<h1 align="center">SquadsZ - Server</h1>

<p align="center">
     <img src=https://img.shields.io/github/languages/code-size/IgorSantoss/squadsz?style=for-the-badge hspace="2" vspace="20"/>
    <img src=https://img.shields.io/github/license/IgorSantoss/squadsz?style=for-the-badge hspace="2" vspace="20"/>
    <img src=https://img.shields.io/github/issues/IgorSantoss/squadsz?style=for-the-badge hspace="2" vspace="20"/>
</p>

<!-- ABOUT -->

## About

Project that provides the API to be used in [squadsz client](https://github.com/vitormrts/squadsz-client)

<!-- TECHONOLOGIES -->

## 🚀 Technologies

- ✔️ Node
- ✔️ PostgreSQL
- ✔️ Docker
- ✔️ Docker compose

<!-- HOW TO USE -->

## ℹ️ How To Use

### ESLint and Prettier

You need to have 3 plugins installed in your text editor to keep a pattern in the project: `ESLint`, `Prettier` and `EditorConfig`.

These plugins are already configured in the project in the `prettier.config.js`, `.eslintrc.json` and `editorconfig` files.

### Environment Variables

If you want to set the environment variables, create a `.env` file based on the `.env.example` template

### Installation

To modify (locally) this project, you will need [Node](https://nodejs.org/en/), [GIT](https://git-scm.com/) and [docker-compose](https://docs.docker.com/compose/) installed on your computer.

With these tools in hand, follow the steps below

```sh
# Clone this repository
$ git clone https://github.com/IgorSantoss/squadsz

# Go to the repository cloned
$ cd squadsz

# Install dependencies
$ make install

# Start server
$ make up
```

Done! Now you have this application in your computer.

### Commands Info

```sh
# Install dependencies
$ make install

# Build image
$ make build

# Up and start docker container
$ make up

# Stop and remove docker container
$ make down

# Start docker container (already created)
$ make start

# Stop docker container (already created)
$ make stop

# Restart docker
$ make restart

# See logs
$ make logs

# Compile scss files in real time
$ make dev
```

<!-- CONTRIBUTING -->

## 🤝 Contributing

To contributing to this project, follow the steps bellow.

1. Fork the Project;
2. Create your Feature Branch (`git checkout -b new-branch`)
3. Commit your Changes (`git commit -m 'DESCRIPTION OF CHANGES'`)
4. Push to the Branch (`git push origin new-branch`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](https://github.com/IgorSantoss/squadsz/blob/master/LICENSE) file for more details.

---

<p align="center">Made with ❤️ by <strong><a href="https://github.com/vitormrts" target="_blank">Vitor Martins</a></strong> ✌ </p>
