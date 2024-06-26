export const HomeIcon = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-8 w-8"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill={color}
      d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
    />
  </svg>
);

export const StatsIcon = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-8 w-8"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill={color}
      d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"
    />
  </svg>
);

export const UserIcon = ({ name, color }: { name: string; color: string }) => (
  <span className="relative flex items-center gap-2">
    <svg
      className="h-8 w-8"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        fill={color}
        d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"
      />
    </svg>
    <span
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-lg"
      style={{
        color: color,
        fontWeight: 500,
      }}
    >
      {name}
    </span>
  </span>
);

export const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-8 w-8"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
  >
    <path
      fill="currentColor"
      d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
    />
  </svg>
);

export const ArrowLeftIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-8 w-8"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
  >
    <path
      fill="currentColor"
      d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
    />
  </svg>
);

export const DeleteIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
    />
  </svg>
);

export const ArrowUp = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 329.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"
    />
  </svg>
);

export const CloseIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 30"
  >
    <path
      fill="currentColor"
      d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"
    />
  </svg>
);

export const CompleteIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
  >
    <path
      fill="currentColor"
      d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z"
    />
  </svg>
);

export const MoveIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"
    />
  </svg>
);

export const BackIcon = () => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 1024 1024"
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
    />
    <path
      fill="currentColor"
      d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
    />
  </svg>
);

export const InstallIcon = () => (
  <svg
    height="800px"
    width="800px"
    version="1.1"
    id="_x32_"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="h-4 w-4"
  >
    <g>
      <path
        fill="currentColor"
        d="M426.537,0H179.641c-22.243,0-40.376,18.175-40.376,40.401v129.603h25.221V69.106h277.206V424.46H164.485 v-83.887h-25.221v131.034c0,22.192,18.133,40.392,40.376,40.392h246.896c22.192,0,40.375-18.2,40.375-40.392v-129.03V40.401 C466.912,18.175,448.728,0,426.537,0z M303.08,478.495c-9.174,0-16.636-7.47-16.636-16.661c0-9.183,7.462-16.653,16.636-16.653 c9.158,0,16.686,7.47,16.686,16.653C319.766,471.025,312.247,478.495,303.08,478.495z"
      />
      <polygon
        fill="currentColor"
        points="225.739,335.774 358.778,255.289 225.739,174.804 225.739,221.11 45.088,221.11 45.088,289.468 225.739,289.468"
      />
    </g>
  </svg>
);

export const SearchIcon = ({ color }: { color: string }) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
  >
    <path
      d="M17 17L21 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);
