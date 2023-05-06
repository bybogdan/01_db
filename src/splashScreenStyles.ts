// eslint-disable-next-line import/no-anonymous-default-export
export default `
  body {
    display: block
  }

  @media (prefers-color-scheme: light) {
    #splashScreen {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      --tw-text-opacity: 1;
      color: rgb(0 0 0 / var(--tw-text-opacity));
    }
  }

  @media (prefers-color-scheme: dark) {
    #splashScreen {
      --tw-bg-opacity: 1;
      background-color: rgb(30 41 59 / var(--tw-bg-opacity));
      --tw-text-opacity: 1;
      color: rgb(255 255 255 / var(--tw-text-opacity));
    }
  }

  #splashScreen {
    position: fixed;
    z-index: 1700;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @keyframes animation {
    0%    { opacity: 1; }
    50%    { opacity: 0.4; }
    100%  { opacity: 1; }
  }

  .logo {
    position: absolute;
    animation: fast-pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
