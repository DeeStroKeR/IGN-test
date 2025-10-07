import { useState, ReactNode } from 'react'
import { Input, Select, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './registerSteps.module.scss'
import { useUser } from '../../contexts/UserContext';

interface IRegisterSteps {
	title?: string | ReactNode;
	content?: ReactNode;
	button?: string;
}

interface RegisterData {
	name: string;
	gender: string;
	birthday: string;
}

interface RegisterStepsProps {
	onComplete?: (data: RegisterData) => void;
}

function RegisterSteps({ onComplete }: RegisterStepsProps) {
	const [registerData, setRegisterData] = useState<RegisterData>({ 
		name: '', 
		gender: '', 
		birthday: '' 
	});
	const [currentStep, setCurrentStep] = useState(0);
	const { isLoading } = useUser();

	const handleInputChange = (field: keyof RegisterData, value: string) => {
		setRegisterData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const genderOptions = [
		{ label: 'Male', value: 'male' },
		{ label: 'Female', value: 'female' },
		{ label: 'Non-binary', value: 'non-binary' },
		{ label: 'Prefer not to say', value: 'prefer-not-to-say' }
	];

	const steps: IRegisterSteps[] = [
		{
			title: <h1 className={styles.greetings_title}>Welcome to iGT!</h1>,
			content: <p className={styles.greetings_text}>It’s all about you</p>,
			button: 'Get Started'
		},
		{
			title: <h1 className={styles.step_title}>What would you like me to call you?</h1>,
			content: (
				<Input 
					size='large' 
					placeholder='Your name' 
					value={registerData.name}
					onChange={(e) => handleInputChange('name', e.target.value)}
				/>
			),
			button: 'Continue'
		},
		{
			title: <h1 className={styles.step_title}>Your Gender</h1>,
			content: (
				<Select 
					size='large' 
					placeholder='Select your gender'
					value={registerData.gender || undefined}
					onChange={(value) => handleInputChange('gender', value)}
					options={genderOptions}
					style={{ width: '100%' }}
				/>
			),
			button: 'Continue'
		},
		{
			title: <h1 className={styles.step_title}>Date of Birth</h1>,
			content: (
				<DatePicker 
					size='large' 
					placeholder='Select your date of birth'
					value={registerData.birthday ? dayjs(registerData.birthday) : null}
					onChange={(date) => handleInputChange('birthday', date ? date.format('YYYY-MM-DD') : '')}
					disabledDate={(current) => current && current > dayjs().endOf('day')}
					style={{ width: '100%' }}
				/>
			),
			button: 'Continue'
		},
		{
			title: <h1 className={styles.step_title}>Important Notice</h1>,
			content: <div className={styles.info_wrapper}>
				<p className={`${styles.info_text} ${styles.info_text_accent}`}>iGT-PA is a digital wellbeing assistant designed to provide general emotional support and self-help tools. It does not provide medical diagnosis, treatment, or professional mental health advice.</p>
				<p className={styles.info_text}>If you are experiencing a mental health crisis or feel unsafe, please contact a qualified mental health professional or an emergency helpline immediately.</p>
				<p className={styles.info_text}>iGT-PA is powered by artificial intelligence. Conversations may be reviewed by trained human moderators for safety and quality purposes. Your data is handled according to our Privacy Policy and is never used to make automated clinical decisions about you.</p>
				<p className={`${styles.info_text} ${styles.info_text_accent}`}>If you need urgent help in the UK, call Samaritans on 116 123 (freephone, 24/7). For other countries, visit: <a href='https://www.iasp.info/resources/Crisis_Centres/' target='_blank' rel='noopener noreferrer'>www.iasp.info/resources/Crisis_Centres/</a></p>
			</div>,
			button: 'I Understand'
		},
		{
			title: <h1 className={styles.step_title}>Terms of Use</h1>,
			content: <div className={styles.info_wrapper}><p className={styles.info_text}>By using this app, you agree to our Terms of Use and Privacy Policy.</p></div>,
			button: 'I accept'
		}
	];

	const handleNextStep = () => {
		// Basic validation for form steps
		if (currentStep === 1 && !registerData.name.trim()) {
			return; // Don't proceed if name is empty
		}
		if (currentStep === 2 && !registerData.gender) {
			return; // Don't proceed if gender is not selected
		}
		if (currentStep === 3 && !registerData.birthday.trim()) {
			return; // Don't proceed if date of birth is empty
		}

		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			// Registration complete - pass data to parent component
			console.log('Registration Data:', registerData);
			if (onComplete) {
				onComplete(registerData);
			}
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 1: return registerData.name.trim() !== '';
			case 2: return registerData.gender !== '';
			case 3: return registerData.birthday.trim() !== '';
			default: return true;
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.steps_indicator_wrapper}>
					{steps.map((_, index) => (
						<div 
							key={index}
							className={`${styles.steps_indicator_step} ${
								index <= currentStep ? styles.steps_indicator_step_completed : ''
							}`}
						></div>
					))}
				</div>
				{steps[currentStep].title && <div>{steps[currentStep].title}</div>}
				{steps[currentStep].content && <div>{steps[currentStep].content}</div>}
				<Button 
					type="primary" 
					className={styles.button} 
					onClick={handleNextStep}
					disabled={!isStepValid()}
					loading={isLoading}
				>
					{steps[currentStep].button}
				</Button>
			</div>
		</div>
	)
}

export default RegisterSteps