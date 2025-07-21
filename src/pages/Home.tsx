import { useEffect, useRef, useState } from 'react';
import { Loader } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { ProfileForm } from './profileTypes';
import { client } from '../http/client';
import { useNavigate } from 'react-router';
import { Scene, Persona, ConnectionStateData, ConversationResultResponseBody } from '@soulmachines/smwebsdk';
import { Button, Card } from 'antd';
import { SceneResponse } from '@soulmachines/smwebsdk/lib-esm/websocket-message/scene/SceneResponse';

const apiKey =
  'eyJzb3VsSWQiOiJkZG5hLWlndHBhbHRkLS10ZXN0cHJvamVjdCIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzg5ODUxNjQ3LWE5MmYtNGZhNC1iZDllLTBiMWZhZDg3YWFkZCJ9';

interface Exercise {
  type: string;
  url: string;
}

function Home() {
	const { user } = useAuthenticator((context) => [context.user]);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
	const [userInfo, setUserInfo] = useState<ProfileForm | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [status, setStatus] = useState('Disconnected');
	const [transcript, setTranscript] = useState([]);
	// const [inputText, setInputText] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPersonLoading, setIsPersonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
	const navigate = useNavigate();
	
	useEffect(() => {
		getUserInfo(user.userId)
	}, [user]);

	useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
	// @ts-expect-error skip for now skip for now
    const onStateEventHandler = (scene, event) => {
      const personaState = event.persona?.['1'];
      if (personaState?.speechState === 'speaking') {
        const personaSpeech = personaState.currentSpeech;
        if (personaSpeech) {
			// @ts-expect-error skip for now
          setTranscript(prev => [...prev, { source: 'persona', text: personaSpeech }]);
        }
      }
    };
// @ts-expect-error skip for now
    const onRecognizeResultsHandler = (scene, status, errorMessage, results) => {
      if (!results || results.length === 0) return;
      const result = results[0];
      if (result.final === true) {
        const userSpeech = result.alternatives[0].transcript;
		// @ts-expect-error skip for now
        setTranscript(prev => [...prev, { source: 'user', text: userSpeech }]);
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
  const scene = sceneRef.current;
  if (!scene) return;

  const originalHandler = scene.onSceneMessage;
  scene.onSceneMessage = function (message: SceneResponse) {
    // console.log('🧠 [custom hook] Incoming scene message:', message);
    console.log('WS message received:', message);

    if (message.name === 'conversationResult') {
      console.log('conversationResult:', message);
      const body = message.body as ConversationResultResponseBody;
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
          reset();
          navigate('/breathe')
        }
      }
    }

      return originalHandler.call(this, message);

    
  };
}, [sceneRef.current]);

	const getUserInfo = async (userId: string) => {
		const { data, errors } = await client.models.User.get({ id: userId });
		if (data) {
      setUserInfo(data);
			setIsUserLoading(false);
		}

		if (errors || !data) {
			navigate('/profile');
		}
	}

	const connect = async () => {
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
      const persona = new Persona(sceneRef.current, sceneRef.current?.currentPersonaId);
      persona.conversationSetVariables({
        userInfo: {
          name: userInfo?.name,
          gender: userInfo?.gender,
          jobTitle: userInfo?.jobTitle,
          jobDescription: userInfo?.jobDescription,
          aboutMe: userInfo?.aboutMe,
          birthday: userInfo?.birthday,
          id: user.userId,
        }
      });


      setStatus('Connected');
      const videoState = await sceneRef.current.startVideo();
      console.info('started video with state:', videoState);

      // persona.conversationSend('hello my name is Anton. Im 30 yers old. Love fishing. Im feel bad right now', {
      //   userInfo: {
      //     name: userInfo?.name,
      //     gender: userInfo?.gender,
      //     jobTitle: userInfo?.jobTitle,
      //     jobDescription: userInfo?.jobDescription,
      //     aboutMe: userInfo?.aboutMe,
      //     birthday: userInfo?.birthday,
      //     id: user.userId,
      //   }
      // }, {});
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

  const reset = () => {
    if (sceneRef.current) {
      sceneRef.current.disconnect();
      sceneRef.current = null;
      // setTranscript([]);
    }
    setStatus('Disconnected');
  };

//   const sendMessage = () => {
//   if (!sceneRef.current) return;

//   if (inputText.trim() === '') return;
//   sceneRef.current.sendInputText(inputText);
//   setTranscript(prev => [...prev, { source: 'user', text: inputText }]);
//   setInputText('');
// };

	if (isUserLoading) {
		return <Loader />;
	}


	return (
		<div>
			<p style={{ fontWeight: 'bold' }}>Welcome, {userInfo?.name}. To start, click ‘CONNECT’</p>
			<div>
      <Card style={{ width: '640px', height: '320px', overflow: 'hidden', margin: '0 auto' }}>
        <video
          ref={videoRef}
          id="sm-video"
          width="100%"
          height="100%"
          autoPlay
          playsInline
        />
      </Card>

      <div style={{ margin: "10px auto 0 auto", width: 'fit-content' }}>
        <Button type="primary" disabled={isPersonLoading || status === 'Connected'} onClick={connect}>CONNECT</Button>
        <Button onClick={reset} style={{ marginLeft: 10 }}>
          Disconnect
        </Button>
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
      <p>iGT-PA! is a self-help app we are not clinicians and are not qualified therapists. We cannot offer clinical support for your condition, but we can send valuable insights to your GP or professional therapist. What we can do is support you to manage your anxiety levels which may ease the impact your condition has on you.</p>
      <Card style={{ marginTop: 10, minHeight: '150px', maxHeight: '250px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', height: '250px' }}>
        {transcript.map((entry, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
			{ /* @ts-expect-error skip for now */}
            <strong style={{ color: entry.source === 'user' ? '#31839d' : '#ff8160' }}>
				{ /* @ts-expect-error skip for now */}
              {entry.source === 'user' ? `${userInfo?.name}` : 'AVA'}
            </strong>{' '}
			{ /* @ts-expect-error skip for now */}
            {entry.text}
          </div>
        ))}
      </Card>

      <div style={{ marginTop: 10 }}>Status: <span style={{ fontWeight: 'bold' }}>{status}</span>{loadProgress > 0 && loadProgress < 100 && ` (Loading: ${loadProgress}%)`}</div>
      {error && <p><span style={{ color: 'red', fontWeight: 'bold' }}>Error:</span> {error}</p>}
    </div>
		</div>
	)
}

export default Home