FROM ubuntu:22.04 as base

# update buguntu
RUN apt-get update && \
   apt-get install -y curl gcc musl-dev libssl-dev pkg-config zlib1g-dev

# NODE
RUN curl -o- https://nodejs.org/dist/v18.17.1/node-v18.17.1-linux-x64.tar.xz | tar -xJf - -C /usr/local --strip-components=1
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs
ENV PATH="/usr/local/bin:${PATH}"

# RUST
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

#  ANCHOR
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install 0.29.0

# SOLANA
RUN curl -sSfL https://release.solana.com/v1.17.4/install | sh -
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# YARN
RUN corepack enable
RUN yarn set version 1.22.19

ADD . /cubitorium

WORKDIR /cubitorium/backend

# build back-end
RUN solana-keygen new -o /root/.config/solana/id.json
RUN solana-test-validator &
RUN yarn
RUN yarn build
RUN anchor deploy 

# build front-end
# RUN cd /cubitorium/client; yarn; yarn build

# copy files
# FROM nginx:alpine

# # copy files to nginx
# COPY default.conf /etc/nginx/conf.d/default.conf
# # COPY --from=base /cubitorium/client/dist/* /usr/share/nginx/html/

# # expose nginx
# EXPOSE 80

