# easy-mockserver

This easy-mockserver adds an initialization task using the [mockserver](https://hub.docker.com/r/jamesdbloom/mockserver/).

## Dependencies

There is no dependencies.
so you don't need to install java.
## Usage

The basic usage is as follows.
```bash
$ docker run --name my-easy-mockserver -p 1080:1080 -d loveloper44/easy-mockserver
```
\
If you want to add some apis when initialize mockserver then use like below.  
- Create a file with name following ***.mock.api.json**  
- Place the file in a directory to mount to container volume

```json
[
    {
        "httpRequest": {
            "method": "GET",
            "path": "/healthcheck"
        },
        "httpResponse": {
            "body": {
                "status": "ok"
            },
            "statusCode": 200
        }
    },
    {
        "httpRequest": {
            "method": "GET",
            "path": "/test"
        },
        "httpResponse": {
            "body": "ok",
            "statusCode": 200
        }
    }
]
```

```bash
$ docker run --name my-easy-mockserver -p 1080:1080 -v [path]:/app/apis -d loveloper44/easy-mockserver
```
The format of ***.mock.api.json** is like [mockserver](http://www.mock-server.com)


## Maintainers
Ingyu Yoon  
<loveloper44@gmail.com>
