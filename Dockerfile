FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV MONGO_URI=mongodb+srv://murtaza10dec:mushikhan123@ecotrackapp.poohf8t.mongodb.net/EcoTrackApp?retryWrites=true&w=majority
ENV JWT_SECRET=ecotrack123
ENV PORT=5000
ENV EMAIL=ecotrack4@gmail.com
ENV PASS=kkkgrrellbkoptph
ENV SECRET_KEY=sk_test_51KqjSfH5DTXndbM5MjCvCs84H82cMpaJHsIpk05eoy3WVRA5lN3wDC2tyOqCDw0RENy6VJ6VVErHLhbw9QoMXHeA00LZUO0JR6


EXPOSE 5000

CMD ["npm", "start"]