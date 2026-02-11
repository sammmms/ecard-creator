module.exports = {
  apps: [
    {
      name: "ecard-next",
      script: "server.js",
      cwd: "/var/www/ecard/current",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXTAUTH_URL: "https://ecard.bizapps.id",
        NEXTAUTH_SECRET: "Bizapps#111SecretKey",
        NEXT_PUBLIC_BASE_URL: "https://ecard.bizapps.id",
      },
    },
  ],
};
