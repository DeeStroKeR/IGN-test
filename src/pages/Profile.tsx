import type { ProfileForm } from './profileTypes'
import { Button, Form, Input, DatePicker, message, Select, ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { client } from '../http/client'
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useEffect, useState } from 'react';
import styles from './profile.module.scss'
import { useUser } from '../contexts/UserContext';

const { TextArea } = Input;

function Profile() {
	const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
	const { user: cognitoUser } = useAuthenticator((context) => [context.user]);
	const { user: userInfo, setUser, setLoading } = useUser();
	const [form] = Form.useForm();

	useEffect(() => {
		if (userInfo) {
			form.setFieldsValue({
				name: userInfo.name,
				gender: userInfo.gender,
				birthday: dayjs(userInfo.birthday),
				aboutMe: userInfo.aboutMe,
				jobTitle: userInfo.jobTitle,
				jobDescription: userInfo.jobDescription,
				diagnosis: userInfo.diagnosis,
			});
		}
	}, [userInfo]);

	const updateProfile = async (values: ProfileForm) => {
		setIsFormLoading(true);
		setLoading(true);
		const data: ProfileForm = {
			name: values.name,
			gender: values.gender,
			jobTitle: values.jobTitle,
			jobDescription: values.jobDescription,
			aboutMe: values.aboutMe,
			birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
			diagnosis: values.diagnosis,
			owner: cognitoUser.userId,
		}

		if (userInfo) {
			const {data: updatedUserInfo, errors } = await client.models.User.update({
				...data,
				id : userInfo.id || ''
			})

			if (updatedUserInfo && !errors) {
				form.setFieldsValue({
					name: updatedUserInfo.name,
					gender: updatedUserInfo.gender,
					birthday: dayjs(updatedUserInfo.birthday),
					aboutMe: updatedUserInfo.aboutMe,
					jobTitle: updatedUserInfo.jobTitle,
					jobDescription: updatedUserInfo.jobDescription,
					diagnosis: updatedUserInfo.diagnosis,
				});
				setUser(updatedUserInfo);
			}

			if (errors) {
				message.error(errors[0].message);
			} else {
				message.success('Profile updated successfully');
			}
		} else {
			const {data: updatedUserInfo, errors } = await client.models.User.create({
				...data,
				id: cognitoUser.userId
			})

			if (updatedUserInfo && !errors) {
				form.setFieldsValue({
					name: updatedUserInfo.name,
					gender: updatedUserInfo.gender,
					birthday: dayjs(updatedUserInfo.birthday),
					aboutMe: updatedUserInfo.aboutMe,
					jobTitle: updatedUserInfo.jobTitle,
					jobDescription: updatedUserInfo.jobDescription,
					diagnosis: updatedUserInfo.diagnosis,
				});
				setUser(updatedUserInfo);
			}

			if (errors) {
				message.error(errors[0].message);
			} else {
				message.success('Profile updated successfully');
			}
		}

		setIsFormLoading(false);
		setLoading(false);
	}

	return (
		<>
			<h1 className={styles.header}>Profile</h1>
			{!userInfo && <p className={styles.subheader}>To start use application please update information about yourself</p>}
			<ConfigProvider theme={{
				components: {
					Form: {
						labelFontSize: 14,
						fontSize: 16,
					},
					Input: {
						fontSizeLG: 16,
					},
					Select: {
						fontSizeLG: 16,
					},
					DatePicker: {
						fontSizeLG: 16,
					},
					Button: {
						controlHeight: 40,
					}
				} 
			}}>
				<Form
					name="basic"
					form={form}
					disabled={isFormLoading}
					// labelCol={{ span: 16 }}
					// wrapperCol={{ span: 32 }}
					// initialValues={{ remember: true, ...userInfo }}
					onFinish={updateProfile}
					layout='vertical'
					// onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item<ProfileForm>
						label="Name/Nickname"
						name="name"
						rules={[{ required: true, message: 'Please input your name!' }]}
					>
						<Input size="large" />
					</Form.Item>
		
					<Form.Item<ProfileForm>
						label="Gender"
						name="gender"
						rules={[{ required: true, message: 'Please select your gender!' }]}
					>
						<Select size="large" placeholder="Select your gender">
							<Select.Option value="male">Male</Select.Option>
							<Select.Option value="female">Female</Select.Option>
							<Select.Option value="non binary">Non-binary</Select.Option>
							<Select.Option value="not specified">Not specified</Select.Option>
						</Select>
					</Form.Item>
		
					<Form.Item<ProfileForm>
						label="Date of birth"
						name="birthday"
						rules={[{ required: true, message: 'Please select your birthday!' }]}
					>
						<DatePicker size='large' style={{ width: '100%' }} disabledDate={(current) => current && current > dayjs().endOf('day')} />
					</Form.Item>
	
					<p style={{ fontWeight: 'bold'}}>If you're comfortable with it, share some more info about yourself</p>
	
					<Form.Item<ProfileForm>
						label="What are your hobbies and interests?"
						name="aboutMe"
						colon={false}
					>
						<TextArea rows={4} />
					</Form.Item>
		
					<Form.Item<ProfileForm>
						label="What's your job?"
						name="jobTitle"
						colon={false}
					>
						<Input size="large" />
					</Form.Item>
		
					<Form.Item<ProfileForm>
						label="How would you describe your job?"
						name="jobDescription"
						colon={false}
					>
						<TextArea rows={4} />
					</Form.Item>
		
					<Form.Item<ProfileForm>
						label="Do you have any formal diagnosis or recognised disability you would like us to know about? Knowing this will help us to understand your needs better."
						name="diagnosis"
						colon={false}
					>
						<TextArea rows={4} />
					</Form.Item>
		
					<Form.Item label={null}>
						<Button type="primary" size="middle" htmlType="submit" loading={isFormLoading} disabled={isFormLoading} style={{ backgroundColor: '#ff8160', borderColor: '#ff8160' }}>
							Save
						</Button>
					</Form.Item>
				</Form>
			</ConfigProvider>
		</>
	)
}

export default Profile