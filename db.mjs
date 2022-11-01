//run npm install --save-dev mongoose/mongoose-slug-plugin first
//run mongosh

import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

// TODO: add schemas
const PokemonSchema = new mongoose.Schema({
    name:{type: String, required: true}
})

const ListSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    title:{type: String, required: true},
    pokemons:[PokemonSchema],
    //Array of Pokemon objects
    description:{type: String, required: false},
});

const UserSchema = new mongoose.Schema({
    username:{type: String, required: true},
    email:{type: String, required: true},
    password:{type: String, unique: true, required:true},
    list:[ListSchema]
});


// TODO: configure plugin
UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=username%>'});
ListSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=title%>'});
PokemonSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=name%>'});


//this plugin will autogenerate a slug field (no need to explicitly add it to your schema)
//a slug is a string that serves as a short, human readable name
//usually contains dashes to separate words, and a number suffix

// TODO: register models
mongoose.model('User', UserSchema);
mongoose.model('List', ListSchema);
mongoose.model('Pokemon', PokemonSchema);

mongoose.connect('mongodb://localhost/final_project');