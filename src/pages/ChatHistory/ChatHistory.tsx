import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, Modal } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { client } from '../../http/client';
import { useUser } from '../../contexts/UserContext';
import styles from './chatHistory.module.scss';

interface Conversation {
  id: string;
  title: string;
  transcript: any[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

function ChatHistory() {
  const { user: cognitoUser } = useAuthenticator((context) => [context.user]);
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('📚 CHAT HISTORY: Loading all conversations for user:', cognitoUser.userId);
      const { data } = await client.models.Conversation.list({
        filter: { owner: { eq: cognitoUser.userId } }
      });
      
      const processedConversations = data?.map(conv => ({
        ...conv,
        transcript: typeof conv.transcript === 'string' ? JSON.parse(conv.transcript) : conv.transcript
      })) || [];
      
      const sortedConversations = processedConversations.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log('📚 CHAT HISTORY: Loaded conversations:', sortedConversations.length);
      setConversations(sortedConversations);
    } catch (error) {
      console.error('📚 CHAT HISTORY: Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsConversationModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className={styles.chatHistory}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chat History</h1>
        <p className={styles.subtitle}>View your past conversations with Finn</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <Card className={styles.emptyState}>
          <MessageOutlined className={styles.emptyIcon} />
          <h3>No conversations yet</h3>
          <p>Your conversations with Finn will appear here</p>
        </Card>
      ) : (
        <div className={styles.conversationsList}>
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={styles.conversationCard}
              onClick={() => handleConversationClick(conversation)}
            >
              <div className={styles.date}>{formatDate(conversation.createdAt)}</div>
              <div className={styles.time}>{formatTime(conversation.createdAt)}</div>
              <div className={styles.messageCount}>
                {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''} →
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={selectedConversation ? `Conversation: ${selectedConversation.title}` : 'Conversation'}
        open={isConversationModalOpen}
        onCancel={() => setIsConversationModalOpen(false)}
        centered
        width={800}
        footer={null}
      >
        {selectedConversation && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px 0' }}>
            <div style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
              {selectedConversation.messageCount} messages • {new Date(selectedConversation.createdAt).toLocaleString()}
            </div>
            {selectedConversation.transcript.map((entry: any, index: number) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                {entry.source === 'user' ? (
                  <div style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginLeft: '20px'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#ff8160', 
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      {user?.name || 'You'}
                    </div>
                    <div>{entry.text}</div>
                  </div>
                ) : (
                  <div style={{ 
                    backgroundColor: '#e6f7ff', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginRight: '20px'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#1890ff', 
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      Finn
                    </div>
                    <div>{entry.text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ChatHistory;