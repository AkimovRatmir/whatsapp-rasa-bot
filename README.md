# whatsapp-rasa-bot: a WhatsApp support bot with Rasa NLU

A WhatsApp bot that understands free-text questions in Russian and routes users by topic. Messages
come in through WhatsApp Web, a Rasa NLU model recognizes what the user wants, the bot replies, and
each user's progress is saved in MongoDB.

I built it in July 2025 as a prototype of a support assistant that guides people through a
multi-step process, with questions like «у меня проблема со вторым разделом».

## How it works

```
WhatsApp user ──► whatsapp-web.js ──► NestJS ──► Rasa NLU (intent + confidence)
                                        │
                                        ├──► reply chosen by intent ──► WhatsApp
                                        └──► MongoDB: which section this number is on
```

- **WhatsApp channel** (`src/whatsapploc`): signs in to WhatsApp Web with a QR code shown in the
  terminal, listens for messages, skips ignored numbers and answers in the same chat.
- **NLU** (`src/nlp`): sends the text to the Rasa server's `/model/parse` endpoint and maps the
  recognized intent to a reply.
- **Rasa model** (`rasa-nlu/`): Russian training data for greetings, goodbyes, confirmations and
  "problem with section 1–5" intents, plus stories, rules and test stories.
- **User state** (`src/user`): when a message is about a specific section, the section is saved
  against the user's phone number (Mongoose), so the conversation can continue from there.

## Stack

TypeScript · NestJS · whatsapp-web.js · Rasa 3 (Python) · MongoDB / Mongoose · Axios

## Running it

Requires Node.js 18+, Python 3.10 with Rasa, and MongoDB.

```bash
# 1. Train and start the NLU server
cd rasa-nlu
python3.10 -m venv .venv && source .venv/bin/activate
pip install rasa
rasa train
rasa run --enable-api        # http://localhost:5005

# 2. Start the bot (in another terminal)
cd ..
npm install
cp .env.example .env         # MongoDB URL, Rasa URL, numbers to ignore
set -a; source .env; set +a  # load the settings into the shell
npm run start:dev            # scan the QR code with WhatsApp → Linked devices
```

The WhatsApp login is stored locally in `.wwebjs_auth/`. It's git-ignored on purpose: that folder
gives access to the linked WhatsApp account.

## Author

**Ratmir Akimov**: [github.com/AkimovRatmir](https://github.com/AkimovRatmir)

## License

All rights reserved. The code is published for viewing only. See [LICENSE](LICENSE).
