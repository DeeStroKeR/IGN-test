import { useEffect, useRef, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router';
import { Scene, Persona, ConnectionStateData, ConversationResultResponseBody } from '@soulmachines/smwebsdk';
import { Button, Card } from 'antd';
import { SceneResponse } from '@soulmachines/smwebsdk/lib-esm/websocket-message/scene/SceneResponse';
import styles from './home.module.scss';
import { useUser } from '../contexts/UserContext';
import { client } from '../http/client';

// const apiKey =
//   'eyJzb3VsSWQiOiJkZG5hLWlndHBhbHRkLS10ZXN0cHJvamVjdCIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzg5ODUxNjQ3LWE5MmYtNGZhNC1iZDllLTBiMWZhZDg3YWFkZCJ9';
const apiKey =
  'eyJzb3VsSWQiOiJkZG5hLWlndHBhbHRkLS1wYS1maW5uIiwiYXV0aFNlcnZlciI6Imh0dHBzOi8vZGguc291bG1hY2hpbmVzLmNsb3VkL2FwaS9qd3QiLCJhdXRoVG9rZW4iOiJhcGlrZXlfdjFfNzhkNWJlMTItODE0My00NDIwLWI3MTgtMWM1ZDUzOTYxNTliIn0=';

interface Exercise {
  type: string;
  url: string;
}

interface TranscriptEntry {
  source: 'user' | 'persona';
  text: string;
}

function UserMessage({ text, userName }: { text: string, userName: string }) {
  return <div className={styles.userMessage}>
    <p className={styles.userMessage_message}><span className={styles.userMessage_message_label}>{userName}</span> {text}</p></div>
}

function PersonaMessage({ text }: { text: string }) {
  return <div className={styles.personaMessage}>
    <p className={styles.personaMessage_message}><span className={styles.personaMessage_message_label}>Finn</span> {text}</p></div>
}

function Home() {
	const { user: cognitoUser } = useAuthenticator((context) => [context.user]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const personaInstanceRef = useRef<Persona | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const transcriptStateRef = useRef<TranscriptEntry[]>([]);
  const [status, setStatus] = useState('Disconnected');
	const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
	// const [inputText, setInputText] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPersonLoading, setIsPersonLoading] = useState<boolean>(false);
  const [showPersona, setShowPersona] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const { user: userInfo } = useUser();
	const navigate = useNavigate();
	
	// Auto-scroll to bottom when transcript updates
	useEffect(() => {
		if (transcriptRef.current) {
			transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
		}
	}, [transcript]);
	
	useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
	// @ts-expect-error skip for now skip for now
    const onStateEventHandler = (scene: Scene, event) => {
      const personaState = event.persona?.['1'];
      if (personaState?.speechState === 'speaking') {
        const personaSpeech = personaState.currentSpeech;
        console.log('Persona is speaking:', personaSpeech);
        if (personaSpeech) {
          if (!scene.isMicrophoneActive()) {
            console.log('Setting microphone active');
            scene.setMediaDeviceActive({ microphone: true, camera: true });
          }
          console.log('🤖 Adding Finn message to transcript:', personaSpeech);
          setTranscript(prev => {
            const newTranscript = [...prev, { source: 'persona' as const, text: personaSpeech }];
            transcriptStateRef.current = newTranscript; // Keep ref in sync
            console.log('🤖 Updated transcript after Finn message:', newTranscript);
            return newTranscript;
          });
        }
      }
    };
// @ts-expect-error skip for now
    const onRecognizeResultsHandler = (scene: Scene, status, errorMessage, results) => {
      if (!results || results.length === 0) return;
      const result = results[0];
      if (result.final === true) {
        const userSpeech = result.alternatives[0].transcript;
        console.log('👤 Sending user speech to persona:', userSpeech, personaInstanceRef.current);
        if (personaInstanceRef.current) {
          personaInstanceRef.current.conversationSend(userSpeech, {
            userInfo: {
              name: userInfo?.name,
              gender: userInfo?.gender,
              jobTitle: userInfo?.jobTitle,
              jobDescription: userInfo?.jobDescription,
              aboutMe: userInfo?.aboutMe,
              birthday: userInfo?.birthday,
              id: cognitoUser.userId,
            }
          },
            { kind: 'userTalk' });
        }
        console.log('👤 Adding user message to transcript:', userSpeech);
        setTranscript(prev => {
          const newTranscript = [...prev, { source: 'user' as const, text: userSpeech }];
          transcriptStateRef.current = newTranscript; // Keep ref in sync
          console.log('👤 Updated transcript after user message:', newTranscript);
          return newTranscript;
        });
      }
    };

    scene.onStateEvent.addListener(onStateEventHandler);
    scene.onRecognizeResultsEvent.addListener(onRecognizeResultsHandler);
    scene.connectionState.onConnectionStateUpdated.addListener(
      (connectionStateData: ConnectionStateData) => {
        console.log(connectionStateData);
        setLoadProgress(connectionStateData.percentageLoaded);
      }
    );
    scene.onDisconnectedEvent.addListener((scene: string, sessionId: string, reason: string) => {
      onDisconnectedEventHandler(scene, sessionId, reason);
      setStatus('Disconnected');
    });

    const onDisconnectedEventHandler = (_scene: string, _sessionId: string, reason: string) => {
      const messages = {
      sessionTimeout: '⏱️ The session timed out due to user inactivity.',
      conversationEnded: '💬 The conversation was ended by the NLP provider or persona.',
      controlDisconnected: '🛑 The connection to the orchestration server was lost.',
      normal: '✅ The connection was closed normally.',
    };

      setError(reason in messages ? messages[reason as keyof typeof messages] : `❓ Unknown disconnect reason: ${reason}`);
    };

    return () => {
      scene.onStateEvent.removeListener(onStateEventHandler);
      scene.onRecognizeResultsEvent.removeListener(onRecognizeResultsHandler);
      scene.onDisconnectedEvent.removeListener(onDisconnectedEventHandler);
    };
  }, [sceneRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('Setting up custom scene message handler');
  const scene = sceneRef.current;
  if (!scene) return;

  const originalHandler = scene.onSceneMessage;
  scene.onSceneMessage = async function (message: SceneResponse) {
    // console.log('🧠 [custom hook] Incoming scene message:', message);
    console.log('WS message received:', message);

    if (message.name === 'conversationResult') {
      console.log('conversationResult:', message);
      const body = message.body as ConversationResultResponseBody;
      console.log('conversationResult:', message.body);
      if (
        body &&
        body.output &&
        body.output.context &&
        body.output.context.public_front_task
      ) {
        console.log('Front-end action detected:', body.output.context.public_front_task);
        const publicFrontTask = body.output.context.public_front_task;
        let json: Exercise | null = null;
        if (typeof publicFrontTask === 'string' && publicFrontTask.trim() !== '') {
          try {
            json = JSON.parse(publicFrontTask);
          } catch (e) {
            console.warn('Failed to parse public_front_task:', e);
          }
        }
        if (json && json.type === "open_external_link" && json.url) {
          console.log('Opening external link:', json.url);
          await reset();
          navigate('/breathe')
        }
      }
    }

      return originalHandler.call(this, message);

    
  };
}, [sceneRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

	const connect = async () => {
    console.log('🚀 CONNECT: Starting connection process');
    console.log('🚀 CONNECT: Current transcript length:', transcript.length);
    setShowPersona(true);
    setIsPersonLoading(true);
    if (!videoRef.current) {
      console.warn('Video element not mounted yet');
      return;
    }

    setStatus('Connecting...');

    sceneRef.current = new Scene({
      apiKey: apiKey,
      videoElement: videoRef.current,
      requestedMediaDevices: { microphone: true, camera: true },
      requiredMediaDevices: { microphone: true, camera: true },
    });

    try {
      await sceneRef.current.connect();
      sceneRef.current.setMediaDeviceActive({
        microphone: false,
        camera: true
      });
      const persona = new Persona(sceneRef.current, sceneRef.current?.currentPersonaId);
      personaInstanceRef.current = persona;
      persona.conversationSend('init', {
        userInfo: {
          name: userInfo?.name,
          gender: userInfo?.gender,
          jobTitle: userInfo?.jobTitle,
          jobDescription: userInfo?.jobDescription,
          aboutMe: userInfo?.aboutMe,
          birthday: userInfo?.birthday,
          id: cognitoUser.userId,
        }
      }, {
        kind: 'init'
      });
      persona.conversationSetVariables({
        userInfo: {
          name: userInfo?.name,
          gender: userInfo?.gender,
          jobTitle: userInfo?.jobTitle,
          jobDescription: userInfo?.jobDescription,
          aboutMe: userInfo?.aboutMe,
          birthday: userInfo?.birthday,
          id: cognitoUser.userId,
        }
      });


      setStatus('Connected');
      const videoState = await sceneRef.current.startVideo();
      console.info('🚀 CONNECT: Started video with state:', videoState);
      console.log('🚀 CONNECT: Connection successful, ready for conversation');
      
      setIsPersonLoading(false);
    } catch (error: unknown) {
      setStatus('Connection failed');
      if (typeof error === 'object' && error !== null && 'name' in error && 'message' in error) {
        switch ((error as { name: string }).name) {
          case 'noUserMedia':
            console.log('🎙️ User declined access to microphone/camera or they are unavailable.');
            setError('🎙️ User declined access to microphone/camera or they are unavailable.');
            break;

          case 'noScene':
            console.log('🧑‍🚀 No persona available, server might be busy.');
            setError('🧑‍🚀 No persona available, server might be busy.');
            break;

          case 'serverConnectionFailed':
            console.log('🌐 Failed to connect to the server.');
            setError('🌐 Failed to connect to the server.');
            break;

          case 'notSupported':
            console.log('🧭 Browser does not support getUserMedia.');
            setError('🧭 Browser does not support getUserMedia.');
            break;

          case 'mediaStreamFailed':
            console.log('📡 Audio/video stream failed to start.');
            setError('📡 Audio/video stream failed to start.');
            break;

          case 'sessionTimeout':
            console.log('⏱️ Session timed out before it was fully available.');
            setError('⏱️ Session timed out before it was fully available.');
            break;

          case 'controlFailed':
            console.log('🕹️ Failed to establish a control connection to the orchestration server.');
            setError('🕹️ Failed to establish a control connection to the orchestration server.');
            break;

          case 'noSessionToResume':
            console.log('🔁 Could not resume previous session with session persistence.');
            setError('🔁 Could not resume previous session with session persistence.');
            break;

          default:
            console.log('❓ Unhandled error:', (error as { name: string }).name, (error as { message: string }).message);
            setError(`❓ Unhandled error: ${(error as { name: string }).name} - ${(error as { message: string }).message}`);
            break;
        }
      } else {
        console.log('❓ Unhandled error:', error);
        setError(`❓ Unhandled error: ${error}`);
      }
    }
  };

  const reset = async () => {
    const currentTranscript = transcriptStateRef.current;
    console.log('🛑 RESET: End Conversation button clicked!');
    console.log('🛑 RESET: Current transcript length:', currentTranscript.length);
    console.log('🛑 RESET: Full transcript contents:', currentTranscript);
    
    // Save conversation if there are messages
    if (currentTranscript.length > 0) {
      try {
        // Generate a title from the first user message or use timestamp
        let title = `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        const firstUserMessage = currentTranscript.find(entry => entry.source === 'user');
        if (firstUserMessage) {
          title = firstUserMessage.text.slice(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '');
        }

        console.log('💾 SAVE: Attempting to save conversation with title:', title);
        console.log('💾 SAVE: Data being saved:', {
          title,
          transcript: currentTranscript,
          messageCount: currentTranscript.length,
          owner: cognitoUser.userId
        });

        const result = await client.models.Conversation.create({
          title,
          transcript: JSON.stringify(currentTranscript),
          messageCount: currentTranscript.length,
          owner: cognitoUser.userId
        });
        
        console.log('💾 SAVE: Full result:', result);
        if (result.errors && result.errors.length > 0) {
          console.error('❌ SAVE: Save failed with errors:', result.errors);
          result.errors.forEach((err, i) => {
            console.error(`❌ SAVE: Error ${i + 1}:`, err);
          });
        } else if (result.data) {
          console.log('✅ SAVE: Conversation saved successfully!', result.data);
        }
        
        // Trigger a page reload to refresh conversation list (temporary solution)
        setTimeout(() => {
          console.log('🔄 RELOAD: Refreshing page to update sidebar...');
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('❌ SAVE: Error saving conversation:', error);
        console.error('❌ SAVE: Error details:', JSON.stringify(error, null, 2));
      }
    } else {
      console.log('⚠️ SAVE: No transcript to save - conversation was empty');
    }

    if (sceneRef.current) {
      console.log('🧹 CLEANUP: Disconnecting scene and clearing transcript...');
      setShowPersona(false);
      setTranscript([]);
      transcriptStateRef.current = []; // Also clear the ref
      sceneRef.current.disconnect();
      sceneRef.current = null;
    }
    setStatus('Disconnected');
    console.log('🛑 RESET: Complete! Status set to Disconnected');
  };

//   const sendMessage = () => {
//   if (!sceneRef.current) return;

//   if (inputText.trim() === '') return;
//   sceneRef.current.sendInputText(inputText);
//   setTranscript(prev => [...prev, { source: 'user', text: inputText }]);
//   setInputText('');
// };

  // Debug log current state
  console.log('🔄 RENDER: Current transcript state:', transcript);
  console.log('🔄 RENDER: Status:', status, 'Show persona:', showPersona);

	return (
		<>
      {!showPersona && <>
        <p className={styles.greeting}>Welcome, {userInfo?.name}</p>
        <p className={styles.heading}>Finn is ready to chat whenever you are.</p>
      </>}
        <>
          {<video
            className={styles.video}
            ref={videoRef}
            id="sm-video"
            autoPlay
            playsInline
            style={{ opacity: status === 'Connected' && showPersona ? 1 : 0 }}
          />}

        <div className={styles.space}></div>
        <div className={styles.buttons}>
          {status !== 'Connected' && <Button type="primary" disabled={isPersonLoading || status === 'Connected'} onClick={connect} style={{ backgroundColor: '#ff8160', borderColor: '#ff8160' }}>Talk</Button>}
          {status === 'Connected' && <Button type="primary" onClick={reset} style={{ marginLeft: 10 }}>
            End conversation
          </Button>}
        </div>
        {/* use persona.conversationSend to send text to backend. also need write logic to handle this messages because this messages has another type of message name */}
        {/* <div style={{ marginTop: 10 }}>
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here"
            style={{ width: '400px' }}
            onKeyDown={e => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <Button type="primary" onClick={sendMessage} style={{ marginLeft: 5 }}>
            Send
          </Button>
        </div> */}

        {!showPersona && <div className={styles.disclaimer}>
          <p className={styles.disclaimer_text}>I Got This! is a self-help application, we are not clinicians and are not qualified therapists. We cannot offer clinical support for your condition, but we can send valuable insights to your GP or professional therapist but only with your consent. What we can do is support you to manage your anxiety levels which may ease the impact your condition has on you.</p>
        </div>}
        {showPersona && <Card 
          ref={transcriptRef}
          style={{ marginTop: 10, minHeight: '150px', maxHeight: '250px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', height: '250px' }}>
          {transcript.map((entry, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              {entry.source === 'user' ? <UserMessage text={entry.text} userName={userInfo?.name || 'Anonymous'} /> : <PersonaMessage text={entry.text} />}
            </div>
          ))}
        </Card>}

        <div style={{ marginTop: 10 }}>Status: <span style={{ fontWeight: 'bold' }}>{status}</span>{(status === 'Connected' && transcript.length < 1) && ` loading avatar...`}{loadProgress > 0 && loadProgress < 100 && ` (Loading: ${loadProgress}%)`}</div>
        {error && <p><span style={{ color: 'red', fontWeight: 'bold' }}>Error:</span> {error}</p>}
      </>
		</>
	)
}

export default Home