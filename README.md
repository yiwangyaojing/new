# front-api

小程序API服务

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### Runner

在构建 Docker 化过的项目时，我们需要大量用到 docker build, docker run 等命令行。我们有 3 种方法可以采用，每种方法都有优势和不足，我们这里采用的是直接绑定 host 主机上的 docker socket 给 runner 运行的 `docker:latest` 镜像容器来使用，可参考[如何在 Runner 里使用 Docker Build](https://docs.gitlab.com/ce/ci/docker/using_docker_build.html#using-the-overlayfs-driver)。
1. 运行以下命令行注册:

    ```sh
    sudo gitlab-runner register -n \
      --url https://lab.xiaosolar.com/ \
      --tag-list "front-api" \
      --registration-token 2g8Yq3Pt-FS7yu1uZiJQ \
      --executor docker \
      --description "Louis xiaosolar runner" \
      --docker-image "docker:latest" \
      --docker-volumes /var/run/docker.sock:/var/run/docker.sock
    ```

   运行以下命令查看产生的配置文件，修改 concurrent = 2:
   ```sh
   sudo nano /etc/gitlab-runner/config.toml
   ```

   注意：
   - 选用 `docker:latest` 镜像，包含了 docker 和 docker-compose 命令行。
   - `registration-token` 该值在 GitLab ncwz-node 项目的 Settings -> CI/CD 获取。
   - `executor` 这里我们选用 docker 执行器
   - `tag-list` 需要和 `.gitlab-ci.yml` 文件中的 `tags` 一致
   - [如何选用 executor 执行器](https://docs.gitlab.com/runner/executors/README.html#i-am-not-sure)
   - [GitLab Runner 命令行工具](https://docs.gitlab.com/runner/commands/README.html)