// eslint-disable-next-line import/no-anonymous-default-export
export default `
  body {
    display: block
  }

  #splashScreen {
    position: fixed;
    z-index: 1700;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    display: flex;
    right: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }

  @keyframes animation {
    0%    { opacity: 1; }
    50%    { opacity: 0.8; }
    100%  { opacity: 1; }
  }

  .logo {
    position: relative;
    animation: animation 1s infinite;
  }
`;
