import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import Providers from "next-auth/providers";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { readFileSync } from "fs";
import path from "path";

import nodemailer from "nodemailer";

// const emailsDir = path.resolve(process.cwd(), "emails");

// const sendVerificationRequest = () => {
//   console.log("sendVerificationRequest");

//   // const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
//   //   encoding: 'utf8',
//   // });
//   // const emailTemplate = Handlebars.compile(emailFile);
//   transporter.sendMail({
//     from: `"⚡ Magic NextAuth" ${process.env.EMAIL_FROM}`,
//     to: "josselin.caer@gmail.com",
//     subject: "Your sign-in link for Magic NextAuth",
//     html: `<p>sendVerificationRequest</p>`,
//   });
// };

// const sendWelcomeEmail = async () => {
//   console.log("sendWelcomeEmail");

//   // const { email } = user;

//   try {
//     // const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
//     //   encoding: 'utf8',
//     // });
//     // const emailTemplate = Handlebars.compile(emailFile);
//     await transporter.sendMail({
//       from: `"⚡ Magic NextAuth" ${process.env.EMAIL_FROM}`,
//       to: "josselin.caer@gmail.com",
//       subject: "Welcome to Magic NextAuth! 🎉",
//       html: `<p>sendWelcomeEmail</p>`,
//     });
//   } catch (error) {
//     console.log(`❌ Unable to send welcome email to user (${"email"})`);
//   }
// };

const config: any = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  // events: { createUser: sendWelcomeEmail },
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: ["identify", "email"].join(" ") } },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: DynamoDBAdapter(client),
  pages: {
    signIn: "/auth/signin",
  },
  theme: {
    colorScheme: "auto",
    brandColor: "#62258e", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "white", // Hex color code
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("callbacks signin", user, account, profile);

      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
};

export default NextAuth(authOptions);
