# borg
Discord bot army

## Environment variables
| Name | Description | Example | Default |
| --- | --- | --- | --- |
| `TOKENS` | An array of Discord bot tokens that the bots will use. | `["GEJG8tOVnw2Hyh4Olu.sBxf2FyEaQJ.cMq.lfsLzrSIzMFNf9d3qTqxRrnq", "HuhrpXewg.wzje4drW4hZ96Ojm.GgqOyrZCKgZZaa3RGZCoob3c9nUwYJsu"]` | `[]` (**Required**) |
| `PREFIX` | Command prefix. | `\]` (e.g. `\]allsay h`) | `\]` (Will run without it, but you won't really be able to do anything) |
| `CHANNELS` | A JSON dictionary of the channels the Collective can speak in. | `{"random server name or whatever you want - #general":"<CHANNEL ID HERE>"}` | `{}` (**Required**) |
| `ADMINS` | A JSON dictionary of the users that are allowed to use Schism's admin commands. | `{"You, probably":"<USER ID HERE>"}` | `{}` (Recommended, but optional) |
| `BANNED` | A JSON-encoded dictionary of the users that aren't allowed to use Schism's commands. Schism will also stop learning from this user. | `{"Naughty boy":"<USER ID HERE>"}` | `{}` (Optional) |
