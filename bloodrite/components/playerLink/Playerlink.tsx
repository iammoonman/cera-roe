import Link from 'next/link'
import React from 'react';

const PlayerLink = ({player}) => {
    if(player.id > 0)
    return (
        <Link href={`/player/${player.id}`}><a className="decoration-0 hover:text-stone-600">{player.name}</a></Link>
    )

    return (
        <div>{player.name}</div>
    )
}
export default PlayerLink;
