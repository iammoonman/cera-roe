import { GUILD, TOKEN } from '$env/static/private';
import { Client, Events, GatewayIntentBits } from 'discord.js';

export const DiscordClient = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] });
DiscordClient.login(TOKEN);
await DiscordClient.guilds.fetch(GUILD).then(() => console.log('Guild fetched.'));
DiscordClient.addListener(Events.ClientReady, () => console.log('Client is logged in!'));
DiscordClient.addListener(Events.Error, (e) => console.log('Ran into an error.', e));
