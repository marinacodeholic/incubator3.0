import {app} from "./app";

const port = process.env.Port || 8089

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})