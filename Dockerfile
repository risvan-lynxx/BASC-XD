FROM quay.io/loki-xer/jarvis-md:latest
RUN git clone https://github.com/risvan-lynxx/BASC-XD /root/lynx/
WORKDIR /root/lynx/
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
