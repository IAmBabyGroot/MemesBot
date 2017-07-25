const Discord = require('discord.js');
const client = new Discord.Client();
var Member;
var Guild;
var Guilds;

const prefix = "mb."

client.on('ready', function() {
    console.log("Ready");
    client.user.setGame("on " + client.guilds.size + " guild(s)");
});

client.on('guildDelete', guild => {
  console.log(`I have left ${guild.name} at ${new Date()}`);
});

client.on('guildCreate', guild => {
  guild.defaultChannel.send(`I have joined ${guild.name}`);
});

client.on('guildMemberAdd', function(member) {
    let Guild = member.guild;
    Guild.defaultChannel.send(`Welcome ${member.user.username} to ${Guild.name}!`);
});

client.on('guildMemberRemove', function(member) {
    let Guild = member.guild;
    Guild.defaultChannel.send(`Goodbye ${member.user.username}!`);
});

client.on('channelCreate', function(channel) {
    console.log(`A ${channel.type} channel by the name of ${channel.name} was created @ ${channel.createdAt} on ${channel.guild}`);
    if (channel.type === "text") {
        channel.send(`You created #${channel.name} @ ${channel.createdAt}!`);
    }
});
client.on('messageDelete', function(message) {
    if (message.guild.channels.find("name", "server-log")) {
        var serverLog = message.guild.channels.find("name", "server-log");
        serverLog.send(`${message.author.username} sent ${message} @ ${message.createdAt} in ${message.channel.name}`);
    }
});

client.on('message', function(message) {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(prefix.length).toLowerCase();

    switch (command) {
        case "setnick":
            if (message.guild.member(message.author).hasPermission("CHANGE_NICKNAME")) {
            Member = message.mentions.members.first();
                var newNick = args.slice(1).join(" ");
                Member.setNickname(newNick);
                message.channel.send(`${Member.user.tag}'s nick is now: ${newNick}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "createrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
                Guild = message.guild;
                Guild.createRole({
                    "name": args[0],
                    "color": args[1],
                    "permissions": args[2]
                });
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "setrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                Member = message.mentions.members.first();
                var newRole = args.slice(1).join(" ");
                Guild = message.guild;
                var newrole = Guild.roles.find("name", newRole);
                Member.removeRoles(Member.roles);
                Member.addRole(newrole);
                message.channel.send(`${Member.user.tag} is now: ${newRole}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "addrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                Member = message.mentions.members.first();
                var newRole = args.slice(1).join(" ");
                Guild = message.guild;
                var newrole = Guild.roles.find("name", newRole);
                Member.addRole(newrole);
                message.channel.send(`${Member.user.tag} has been given: ${newRole}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "getowner":
            message.channel.send(message.guild.owner.displayName);
            break;
        case "serverinfo":
            message.channel.send("Owner: " + message.guild.owner.displayName + "\n" + "Main Chat");
            break;
        case "setowner":
            if (message.author.id === "260470661732892672") {
                message.guild.setOwner(message.author);
                message.channel.send(message.guild.owner.displayName);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "help":
            message.channel.send("Commands: getowner, serverinfo, addrole, setrole, createrole, setnick, help");
            break;
        default:
            message.reply("That is not a command");
    }

});

client.login(process.env.token);