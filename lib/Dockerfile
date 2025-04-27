FROM quay.io/loki-xer/jarvis-md:latest
RUN git clone https://github.com/risvan-lynxx/BASC-XD /root/bristo/
WORKDIR /root/bristo/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
