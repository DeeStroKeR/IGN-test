import type { ProfileForm } from './profileTypes'
import { Button, Form, Input, DatePicker, message, Select } from 'antd'
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
				gender: data.gender,
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
			gender: values.gender,
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
			<p style={{ fontWeight: 'bold'}}>{userInfo ? 'Update your profile information below:' : 'To start use application please update information about yourself'}</p>
			<Form
				name="basic"
				form={form}
				disabled={isFormLoading}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 800 }}
				initialValues={{ remember: true, ...userInfo }}
				onFinish={updateProfile}
				// onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item<ProfileForm>
					label="Name/Nickname"
					name="name"
					rules={[{ required: true, message: 'Please input your name!' }]}
				>
					<Input />
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="Gender"
					name="gender"
					rules={[{ required: true, message: 'Please select your gender!' }]}
				>
					<Select>
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
					<DatePicker disabledDate={(current) => current && current > dayjs().endOf('day')} />
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
					<Input />
				</Form.Item>
	
				<Form.Item<ProfileForm>
					label="How would you describe your job?"
					name="jobDescription"
					colon={false}
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