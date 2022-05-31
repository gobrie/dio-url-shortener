import { URLModel } from "../database/model/URL";
import { Request, Response } from "express";
import shortId from "shortid"
import { config } from "../config/Constants";

export class URLcontrolller {
    public async shorten(req: Request, res: Response): Promise<void> {
      
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })

        if (url) {
            res.json(url)
        }
        const hash = shortId.generate()
        const shortenedURL = `${config.API_URL}/${hash}`
        

        const newURL = URLModel.create({ hash, shortenedURL, originURL })
      
        res.json(newURL)
    }

    public async redirect(req: Request, res: Response): Promise<void> {

        const { hash } = req.params
        const url = await URLModel.findOne({ hash })

        if (url) {
            res.redirect(url.originURL)
            return
        }


        res.status(400).json({ error: 'url not found' })


        res.redirect(url.originURL)
    }
}