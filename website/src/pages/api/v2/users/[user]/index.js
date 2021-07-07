import { withSSRContext } from 'aws-amplify';

import { getItem, setItem } from 'src/util/api';

const handler = async (req, res) => {
  try {
    const {
      query: { user: pk, sk = 'v0_metadata' },
      method,
      body,
    } = req;

    console.log({ method, body });

    const { Auth } = withSSRContext({ req });
    const sub = (await Auth.currentAuthenticatedUser())?.attributes?.sub;

    if (!sub) res.status(401).end('Unauthenticated request');

    switch (method) {
      case 'GET':
        if (sub !== pk) {
          res.status(403).end('User mismatch');
        } else res.status(200).json({ data: (await getItem(pk, sk))?.Item });
        break;
      case 'PUT':
        if (sub !== pk) {
          res.status(403).end('User mismatch');
        } else {
          res.status(200).json({
            data: await setItem(pk, sk, body, sub),
          });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default handler;
