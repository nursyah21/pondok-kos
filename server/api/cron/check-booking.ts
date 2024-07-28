import type {EventHandlerRequest, EventHandlerResponse} from 'h3'

export default function handler(req:EventHandlerRequest, res: EventHandlerResponse) {
    res.end('Hello Cron!');
}