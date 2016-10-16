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
    'Damage': 'dmglvl',
    'Multiplayer Attack': 'fboff',
    "Multiplayer Defense": 'fbdef'
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

var Wikifier = {
    Window: {
        Table: {
            buildRow: function(array) {
                var row = $('<tr>');
                for (var i = 0; i < array.length; i++)
                    row.append(array[i]);
                return row;
            },
            buildCell: function(content) {
                return $('<td>').html(content);
            },
            buildLabel: function(text) {
                return $('<td>').text(text).css({
                    'line-height': '30px',
                    'font-weight': 'bold'
                });
            },
            buildTable: function() {
                var table = $('<table>');
                var r1Content = [Wikifier.Window.Table.buildLabel("Item Id: "), Wikifier.Window.Table.buildCell(new west.gui.Textfield('wikifier_item_id').setSize(15).onlyNumeric().getMainDiv())];
                var r1 = Wikifier.Window.Table.buildRow(r1Content);
                var r2Content = [Wikifier.Window.Table.buildLabel("Image name: "), Wikifier.Window.Table.buildCell(new west.gui.Textfield('wikifier_img_name').setSize(15).getMainDiv())];
                var r2 = Wikifier.Window.Table.buildRow(r2Content);
                table.append(r1).append(r2);
                var result = $("<td>").attr('colspan', '2').html(new west.gui.Textarea(null, null).setId('wikifier_result').setWidth(225).setHeight(260).getMainDiv());
                table.append(result);
                return table;
            }
        }
    },
    open: function() {
        var content = $('<div>');
        content.append(Wikifier.Window.Table.buildTable());
        var button = new west.gui.Button("Wikify it!", function() {
            var itemId = $('#wikifier_item_id').val();
            $('#wikifier_result').val(Wikifier.wikifyItem(itemId));
        });
        content.append(button.getMainDiv());
        var contentScroll = new west.gui.Scrollpane().appendContent(content);
        wman.open("wikifier", "Item Wikifier").setMiniTitle("Item Wikifier").setSize(300, 480).appendToContentPane(contentScroll.getMainDiv());
    },
    wikifyItem: function(itemID) {
        var item = ItemManager.get(itemID);
        if (item === undefined) {
            return "Item not found"
        } else {
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
                                var regex = /\+(\d|\d.\d{0,3})\s(.*) \((Fort battle bonus|Fort battle sector bonus|per Level)\)/g;
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
                        if (values != 0)
                            all += `${fortKeys[id]}=${values}|`;
                    });
                } else if (key.toLowerCase() == "fortbattlesector") {
                    $.each(props, function(id, values) {
                        if (values != 0)
                            all += `${fortSectorKeys[id]}=${values}|`;
                    });
                }
            });
            if (item.speed != null)
                all += `${keyNames['speed']}=${item.speed}|`;
            if (item.type == "right_arm" || item.type == "left_arm")
                all += `dmg=${item.damage.damage_min}-${item.damage.damage_max}|`;
            var isUpgradeable = (item.upgradeable) ? "1" : "0";
            all += `${keyNames['level']}=${item.level}|${keyNames['upgradeable']}=${isUpgradeable}|${keyNames['item_id']}=${item.item_id}|`;
            var imgName = $('#wikifier_img_name').val();
            if (item.set != null) {
                var setName = west.storage.ItemSetManager._setList[item.set].name;
                all += `set=${setName}|`;
            }
            if (imgName.length > 0)
                all += `img=${imgName}`;
            all += `}}</includeonly><noinclude>[[Category:${item_type_title[item.type]}]]<center>{{Item ${item.name}|R}}</center></noinclude>`;
            return all;
        }
    }
}
Wikifier.open();