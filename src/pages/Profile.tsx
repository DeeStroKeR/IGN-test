import type { ProfileForm } from './profileTypes'
import { Button, Form, Input, DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { client } from '../http/client'
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useEffect, useState } from 'react';
import { Loader } from '@aws-amplify/ui-react';

const { TextArea } = Input;

function Profile() {
	const [userInfo, setUserInfo] = useState<ProfileForm | null>(null);
	const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
	const [isInitDataLoading, setIsInitDataLoading] = useState<boolean>(true);
	const { user } = useAuthenticator((context) => [context.user]);
	const [form] = Form.useForm();

	useEffect(() => {
		getUserInfo(user.userId)
	}, [user]);

	const getUserInfo = async (userId: string) => {
		const { data } = await client.models.User.get({ id: userId });
		if (data) {
			setUserInfo(data);
			// Populate form with user info
			form.setFieldsValue({
				name: data.name,
				surname: data.surname,
				birthday: dayjs(data.birthday),
				aboutMe: data.aboutMe,
				jobTitle: data.jobTitle,
				jobDescription: data.jobDescription,
			});
		}

		setIsInitDataLoading(false);
	}

	const updateProfile = async (values: ProfileForm) => {
		setIsFormLoading(true);
		const data: ProfileForm = {
			name: values.name,
			surname: values.surname,
			jobTitle: values.jobTitle,
			jobDescription: values.jobDescription,
			aboutMe: values.aboutMe,
			birthday: dayjs(values.birthday).format('YYYY-MM-DD'),
			owner: user.userId,
		}

		setIsFormLoading(true);

		if (userInfo) {
			const { errors } = await client.models.User.update({
				...data,
				id : userInfo.id || ''
			})

			if (errors) {
				message.error(errors[0].message);
			} else {
				message.success('Profile updated successfully');
			}
		} else {
			const { errors } = await client.models.User.create({
				...data,
				id: user.userId
			})

			if (errors) {
				message.error(errors[0].message);
			} else {
				message.success('Profile updated successfully');
			}
		}

		setIsFormLoading(false);
	}

	if (isInitDataLoading) {
		return <Loader />;
	}

	return (
		<>
			<h1>Profile</h1>
			<p>{userInfo ? 'Update your profile information below:' : 'To start use application please update information about yourself'}</p>
			<Form
				name="basic"
				form={form}
				disabled={isFormLoading}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true, ...userInfo }}
				onFinish={updateProfile}
				// onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item<ProfileForm>
					label="Name"
					name="name"
					rules={[{ required: true, message: 'Please input your name!' }]}
				>
					<Input />
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="Surname"
					name="surname"
					rules={[{ required: true, message: 'Please input your surname!' }]}
				>
					<Input/>
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="DatePicker"
					name="birthday"
					rules={[{ required: true, message: 'Please select your birthday!' }]}
				>
					<DatePicker />
				</Form.Item>
	
	
				<Form.Item<ProfileForm>
					label="Describe yourself"
					name="aboutMe"
					rules={[{ required: true, message: 'Please describe yourself!' }]}
				>
					<TextArea rows={4} />
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="Job title"
					name="jobTitle"
					rules={[{ required: true, message: 'Please input your job title!' }]}
				>
					<Input />
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="Job description"
					name="jobDescription"
					rules={[{ required: true, message: 'Please describe your job!' }]}
				>
					<TextArea rows={4} />
				</Form.Item>
	
				<Form.Item label={null}>
					<Button type="primary" htmlType="submit" loading={isFormLoading} disabled={isFormLoading}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}

export default Profile