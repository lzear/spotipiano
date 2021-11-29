import path from 'path'
import fs from 'fs'
import { Home } from '../src/home'

export async function getStaticProps() {
  const dir = path.resolve('./public/sounds')
  const sounds = fs.readdirSync(dir)
  return {
    props: {
      sounds,
    },
  }
}

export default Home
