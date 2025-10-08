const colors = {
    primary: '#33a6bf',
    secondary: '#dfd7d7',
    dark: '#2a2e30',
    white: '#ffffff',
    accent: '#ff8160'
  };

export const DualRingLoader = ({ size = 50, text = '' }) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '100vh'}}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: `3px solid ${colors.primary}`,
          borderRadius: '50%',
          borderRightColor: 'transparent',
          animation: 'rotate 1.5s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          top: '15%',
          left: '15%',
          border: `3px solid ${colors.accent}`,
          borderRadius: '50%',
          borderLeftColor: 'transparent',
          animation: 'rotate-reverse 1s linear infinite'
        }} />
      </div>
      {text && <p style={{color: colors.dark, fontSize: '14px', fontWeight: '500'}}>{text}</p>}
      <style>{`
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );