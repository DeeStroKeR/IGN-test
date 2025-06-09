import type { ProfileForm } from './profileTypes'
import { Button, Form, Input, DatePicker } from 'antd'
import { client } from '../http/client'
import { useAuthenticator } from '@aws-amplify/ui-react-core';

const { TextArea } = Input;

function Profile() {
	const { user } = useAuthenticator((context) => [context.user]);
	const updateProfile = async (values: ProfileForm) => {
		await client.models.User.update({
			name: values.name,
			surname: values.surname,
			jobTitle: values.jobTitle,
			jobDescription: values.jobDescription,
			aboutMe: values.aboutMe,
			birthday: values.birthday.toISOString(), // Placeholder, replace with actual date handling
			id: user.userId,
		}).catch((error) => {
			console.error('Error updating profile:', error);
		});
	}

	return (
		<Form
			name="basic"
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			style={{ maxWidth: 600 }}
			initialValues={{ remember: true }}
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
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}

export default Profile