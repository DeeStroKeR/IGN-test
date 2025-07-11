import { useEffect, useRef, useState } from 'react';
import { Loader } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { ProfileForm } from './profileTypes';
import { client } from '../http/client';
import { useNavigate } from 'react-router';
import { Scene, Persona } from '@soulmachines/smwebsdk';
import { Button, Card } from 'antd';

const apiKey =
  'eyJzb3VsSWQiOiJkZG5hLWlndHBhbHRkLS10ZXN0cHJvamVjdCIsImF1dGhTZXJ2ZXIiOiJodHRwczovL2RoLnNvdWxtYWNoaW5lcy5jbG91ZC9hcGkvand0IiwiYXV0aFRva2VuIjoiYXBpa2V5X3YxXzg5ODUxNjQ3LWE5MmYtNGZhNC1iZDllLTBiMWZhZDg3YWFkZCJ9';


function Home() {
	const { user } = useAuthenticator((context) => [context.user]);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
	const [userInfo, setUserInfo] = useState<ProfileForm | null>(null);

	const videoRef = useRef(null);
	const sceneRef = useRef(null);
	const [status, setStatus] = useState('Disconnected');
	const [transcript, setTranscript] = useState([]);
	const [inputText, setInputText] = useState('');
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
// @ts-expect-error skip for now
    scene.onStateEvent.addListener(onStateEventHandler);
	// @ts-expect-error skip for now
    scene.onRecognizeResultsEvent.addListener(onRecognizeResultsHandler);

    return () => {
		// @ts-expect-error skip for now
      scene.onStateEvent.removeListener(onStateEventHandler);
	  // @ts-expect-error skip for now
      scene.onRecognizeResultsEvent.removeListener(onRecognizeResultsHandler);
    };
  }, [sceneRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
  const scene = sceneRef.current;
  if (!scene) return;
  // @ts-expect-error skip for now
  const originalHandler = scene.onSceneMessage;
    // @ts-expect-error skip for now
  scene.onSceneMessage = function (message) {
    // console.log('🧠 [custom hook] Incoming scene message:', message);

    if (message.name === 'conversationResult') {
      console.log('conversationResult:', message);
      if (message.body.output.context.public_front_task) {
        console.log('Front-end action detected:', message.body.output.context.public_front_task);
        const json = JSON.parse(message.body.output.context.public_front_task);
        if (json && json.type === "open_external_link" && json.url) {
          console.log('Opening external link:', json.url);
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
    if (!videoRef.current) {
      console.warn('Video element not mounted yet');
      return;
    }

    setStatus('Connecting...');
// @ts-expect-error skip for now
    sceneRef.current = new Scene({
      apiKey: apiKey,
      videoElement: videoRef.current,
      requestedMediaDevices: { microphone: true, camera: true },
      requiredMediaDevices: { microphone: true, camera: true },
    });

    try {
		// @ts-expect-error skip for now
      const sessionId = await sceneRef.current.connect();
      // @ts-expect-error skip for now
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
      // persona.startSpeaking("hello my friend");
      persona.conversationSend('USERINFO', {
        "name" : 'mynale'
      }, {
        "userInfo": {
          "name": "Ann Watson",
          "gender": "female",
          "jobTitle": "Software Engineer",
          "jobDescription": "Building amazing things with Soul Machines",
          "aboutMe": "I love coding and creating digital experiences.",
          "birthday": "1990-01-01"
        }
      });
      // @ts-expect-error skip for now
      const videoState = await sceneRef.current.startVideo();
      console.info('started video with state:', videoState);
    } catch (error) {
      setStatus('Connection failed');
	  // @ts-expect-error skip for now
      switch (error.name) {
        case 'noUserMedia':
          console.warn('user blocked device access');
          break;
        case 'noScene':
        case 'serverConnectionFailed':
          console.warn('server connection failed');
          break;
        default:
          console.warn('unhandled error:', error);
      }
    }
  };

  const reset = () => {
    if (sceneRef.current) {
		// @ts-expect-error skip for now
      sceneRef.current.disconnect();
      sceneRef.current = null;
      // setTranscript([]);
    }
    setStatus('Disconnected');
  };

  // @ts-expect-error skip for now
  const sendMessage = () => {
  if (!sceneRef.current) return;

  if (inputText.trim() === '') return;
// @ts-expect-error skip for now
  sceneRef.current.sendInputText(inputText);
// @ts-expect-error skip for now
  setTranscript(prev => [...prev, { source: 'user', text: inputText }]);
  setInputText('');
};

	if (isUserLoading) {
		return <Loader />;
	}


	return (
		<div

		>
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
        <Button type="primary" onClick={connect}>CONNECT</Button>
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

      <div style={{ marginTop: 10 }}>Status: <span style={{ fontWeight: 'bold' }}>{status}</span></div>
    </div>
		</div>
	)
}

export default Home