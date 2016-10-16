var item_type_title = {
    head: "Headgear",
    neck: "Neckband",
    left_arm: "Gun",
    right_arm: "Duelling weapon",
    body: "Clothing",
    foot: "Shoes",
    animal: "Animal",
    yield: "Product",
    belt: "Belt",
    pants: "Pants",
    recipe: "Recipe"
};
var item_sub_title = {
    shot: "Firearm",
    hand: "Melee weapon"
};

var keyStrings = {
    'Strength': 'str',
    'Mobility': 'mob',
    'Dexterity': 'dex',
    'Charisma': 'cha',
    'Construction': 'con',
    'Vigor': 'vig',
    'Toughness': 'tou',
    'Stamina': 'sta',
    'Health Points': 'hea',
    'Horseback Riding': 'rid',
    'Reflex': 'ref',
    'Dodging': 'dod',
    'Hiding': 'hid',
    'Swimming': 'swi',
    'Aiming': 'aim',
    'Shooting': 'sho',
    'Setting Traps': 'tra',
    'Fine Motor Skills': 'fin',
    'Repairing': 'rep',
    'Leadership': 'lea',
    'Tactics': 'tac',
    'Trading': 'tra',
    'Animal Instinct': 'ani',
    'Appearance': 'app',
    'Damage': 'dmglvl'
}

var keyNames = {
    charisma: 'cha',
    dexterity: 'dex',
    flexibility: 'mob',
    strength: 'str',
    build: 'con',
    punch: 'vig',
    tough: 'tou',
    endurance: 'sta',
    health: 'hea',
    ride: 'rid',
    reflex: 'ref',
    dodge: 'dod',
    hide: 'Hiding',
    swim: 'swi',
    aim: 'aim',
    shot: 'sho',
    pitfall: 'pit',
    finger_dexterity: 'fin',
    repair: 'rep',
    leadership: 'lea',
    tactic: 'tac',
    trade: 'tra',
    animal: 'ani',
    appearance: 'app',
    speed: 'spd',
    set: 'set',
    price: 'bp',
    sell_price: 'sp',
    upgradeable: 'upg',
    item_id: 'id',
    set: 'set',
    level: 'lvl'
}

var fortKeys = {
    defense: 'fbdef',
    offense: 'fboff',
    resistance: 'fbres'
}

var fortSectorKeys = {
    defense: 'fbdefs',
    offense: 'fboffs',
    damage: 'fbdmgs'
}

var wikifyItem = function(itemID) {
    var item = ItemManager.get(itemID);
    var all = "<includeonly>{{Popup Item|"
    all += item.name + "|";
    if (item.type == "right_arm")
        all += `(${item_sub_title[item.sub_type]})`;
    else
        all += `${item_type_title[item.type]}\n`;

    all += "|{{{1}}}|bg={{#if:{{{bg|}}}|{{{bg}}}|1}}|nb={{#if:{{{nb|}}}|{{{nb}}}|}}|";

    $.each(item.bonus, function(key, props) {
        if (key.toLowerCase() == "item") {
            $.each(props, function(id, values) {
                $.each(values, function(valkey, valval) {
                    if (valkey.toLowerCase() == "desc") {
                        var regex = /\+(.*) (.*) \(per Level\)/g;
                        var attr = regex.exec(valval);
                        var shortKey = keyStrings[attr[2]];
                        all += `${shortKey}=${attr[1]}|`;
                    }
                });
            });
        } else if (key.toLowerCase() == "skills" || key.toLowerCase() == "attributes") {
            $.each(props, function(id, values) {
                all += `${keyNames[id]}=${values}|`;
            });
        } else if (key.toLowerCase() == "fortbattle") {
            $.each(props, function(id, values) {
            	if(values != 0)
                	all += `${fortKeys[id]}=${values}|`;
            });
        } else if (key.toLowerCase() == "fortbattlesector") {
            $.each(props, function(id, values) {
            	if(values != 0)
                	all += `${fortSectorKeys[id]}=${values}|`;
            });
        }
    });
    if (item.speed != null)
        all += `${keyNames[speed]}=${item.speed}|`;
    if (item.type == "right_arm" || item.type == "left_arm")
        all += `dmg=${item.damage.damage_min}-${item.damage.damage_max}|`;
    var isUpgradeable = (item.upgradeable) ? "1" : "0";
    all += `${keyNames['level']}=${item.level}|${keyNames['upgradeable']}=${isUpgradeable}|${keyNames['item_id']}=${item.item_id}|`;

    all += `}}</includeonly><noinclude>[[Category:${item_type_title[item.type]}]]<center>{{Item ${item.name}|R}}</center></noinclude>`;
    return all;
}
//var wikified = `<includeonly>{{Popup Item|Lee's rifle|Gun|{{{1}}}|bg={{#if:{{{bg|}}}|{{{bg}}}|1}}|nb={{#if:{{{nb|}}}|{{{nb}}}|}}|mob=0.04|hid=0.08|aim=0.04|tac=0.04|dmglvl=2|dmg=20-40|lvl=1|upg=1|set=Robert Lee's weapons|id=50218000}}</includeonly><noinclude>[[Category:Guns]]<center>{{Item Lee's rifle|R}}</center></noinclude>`;