FROM node:18.18.2-slim as base

# update debian
RUN apt-get update && \
   apt-get install -y curl gcc musl-dev libssl-dev pkg-config zlib1g-dev bash bzip2

# install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# install Anchor
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install 0.29.0

# copy id.json and install solana
COPY id.json ~/.config/solana/id.json
COPY id.json /root/.config/solana/id.json
RUN curl -sSfL https://release.solana.com/v1.17.4/install | sh -
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# install yarn and set the version
RUN corepack enable
RUN yarn set version 1.22.19

# copy the entire repo
ADD . /cubitorium

WORKDIR /cubitorium 

# Give power to the init script
RUN chmod +x /cubitorium/init.sh

ENTRYPOINT ["/cubitorium/init.sh"]

