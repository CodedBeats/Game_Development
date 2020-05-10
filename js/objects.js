alert("sup");

//example spell object
let FetusDeletus = {
    spell_title: "FetusDeletus",
    spell_function: "FetusDeletus",
    name_id: "#FetusDeletus",
    damage: Math.floor(5 * MagicPower), //magic power would be its own massive seperate thing
    mana_cost: 10,
    //other potential elements that would be effected by an action/ability/spell
    health_cost = 0,
    mana_restore = 0,
    health_restore = 0,
    repeat = 0,
    delay = 0,
    buff_name = 0,
    buff_amount = 0,
    debuff_name = 0,
    debuff_amount = 0,
    opponent_aggression: 0, //opponent aggression would work as likelyhood to attack: start at 100, 
                            //possible moves could decrease it, when it hits 15 it's anger is quelled and ends the fight
                            //when it hits 0 it instantly ends
                            //fighting this way would give 2* exp but would take longer than fighting 2 battles
                            //attacking at any point would set enemy aggression back to 100

    spellFunction() {/*some code for spell to work*/},
},