let casesData = [];
let weaponSkinsData = [];

document.addEventListener("DOMContentLoaded", () => {
    const weaponTypeSelect = document.getElementById("weaponType");
    const gunSelect = document.getElementById("gun");
    const caseSelect = document.getElementById("case");

    const weaponTypes = {
        "Pistol": ["Glock-18", "USP-S", "P2000", "Dual Berettas", "P250", "CZ75-Auto", "Five-SeveN", "Desert Eagle", "R8 Revolver", "Tec-9"],
        "Rifle": ["AK-47", "M4A1-S", "M4A4", "FAMAS", "Galil AR", "AUG", "SG 553", "AWP", "SSG 08", "SCAR-20", "G3SG1"],
        "SMG": ["MAC-10", "MP5-SD", "MP7", "MP9", "P90", "PP-Bizon", "UMP-45"],
        "Sniper Rifle": ["AWP", "SSG 08", "SCAR-20", "G3SG1"],
        "Shotgun": ["MAG-7", "Nova", "Sawed-Off", "XM1014"],
        "Machine Gun": ["M249", "Negev"],
        "Knife": ["Bayonet", "Flip Knife", "Gut Knife", "Karambit", "M9 Bayonet", "Huntsman Knife", "Butterfly Knife", "Falchion Knife", "Shadow Daggers", "Bowie Knife", "Navaja Knife", "Stiletto Knife", "Talon Knife", "Ursus Knife", "Classic Knife", "Paracord Knife", "Nomad Knife", "Survival Knife", "Skeleton Knife", "Kukri Knife"]
    };

    const casesFileInput = document.getElementById("casesFile");
    const weaponSkinsFileInput = document.getElementById("weaponSkinsFile");

    // Populate case dropdown
    weaponTypeSelect.addEventListener("change", () => {
        const selectedType = weaponTypeSelect.value;
        gunSelect.innerHTML = "";

        if (weaponTypes[selectedType]) {
            weaponTypes[selectedType].forEach(gun => {
                const option = document.createElement("option");
                option.value = gun;
                option.textContent = gun;
                gunSelect.appendChild(option);
            });
        }
    });

    casesFileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            casesData = JSON.parse(e.target.result);
            caseSelect.innerHTML = "";
            casesData.forEach(c => {
                const option = document.createElement("option");
                option.value = c.name;
                option.textContent = c.name;
                caseSelect.appendChild(option);
            });
        };
        reader.readAsText(file);
    });

    weaponSkinsFileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            weaponSkinsData = JSON.parse(e.target.result);
        };
        reader.readAsText(file);
    });
});

function saveData() {
    const skinData = {
        weaponType: document.getElementById("weaponType").value,
        gun: document.getElementById("gun").value,
        skinName: document.getElementById("skinName").value,
        statTrak: document.getElementById("statTrak").checked,
        souvenir: document.getElementById("souvenir").checked,
        description: document.getElementById("description").value,
        subdescription: document.getElementById("subdescription").value,
        rarity: document.getElementById("rarity").value,
        wear: document.getElementById("wear").value,
        priceMinNormal: document.getElementById("priceMinNormal").value,
        priceMaxNormal: document.getElementById("priceMaxNormal").value,
        priceMinStatTrak: document.getElementById("priceMinStatTrak").value,
        priceMaxStatTrak: document.getElementById("priceMaxStatTrak").value,
        priceMinSouvenir: document.getElementById("priceMinSouvenir").value,
        priceMaxSouvenir: document.getElementById("priceMaxSouvenir").value,
        selectedCase: document.getElementById("case").value
    };

    if (!skinData.weaponType || !skinData.gun || !skinData.skinName || !skinData.rarity || !skinData.wear) {
        alert("Please fill in all required fields.");
        return;
    }

    const newSkinId = weaponSkinsData.length;
    const formattedName = `${skinData.gun} | ${skinData.skinName}`;
    const imageUrl = `https://raw.githubusercontent.com/TheEnemiez/CS2-IMAGE-API/main/Weapons/${skinData.gun.toLowerCase().replace(" ", "_")}_${skinData.skinName.toLowerCase().replace(" ", "_")}_0.png`;

    const [wearMin, wearMax] = skinData.wear.split('-').map(parseFloat);
    if (isNaN(wearMin) || isNaN(wearMax)) {
        alert("Invalid wear format. Use min-max format.");
        return;
    }

    if (skinData.statTrak && skinData.souvenir) {
        alert("Select either StatTrak or Souvenir, not both.");
        return;
    }

    const priceData = {
        non_stat_trak: {
            min: parseFloat(skinData.priceMinNormal),
            max: parseFloat(skinData.priceMaxNormal)
        },
        stat_trak: {
            min: parseFloat(skinData.priceMinStatTrak),
            max: parseFloat(skinData.priceMaxStatTrak)
        },
        souvenir: {
            min: parseFloat(skinData.priceMinSouvenir),
            max: parseFloat(skinData.priceMaxSouvenir)
        }
    };

    const newSkin = {
        skin_id: newSkinId,
        name: formattedName,
        weapon_type: skinData.weaponType,
        stat_trak: skinData.statTrak,
        souvenir: skinData.souvenir,
        description: skinData.description,
        subdescription: skinData.subdescription,
        image_url: imageUrl,
        rarity: skinData.rarity,
        wear: [wearMin, wearMax],
        price: priceData,
        cases: []
    };

    const selectedCaseName = skinData.selectedCase;
    const selectedCase = casesData.find(c => c.name === selectedCaseName);
    if (selectedCase) {
        if (!selectedCase.skins[skinData.rarity]) {
            selectedCase.skins[skinData.rarity] = [];
        }
        selectedCase.skins[skinData.rarity].push(newSkinId);
        newSkin.cases.push(selectedCase.case_id);
    }

    weaponSkinsData.push(newSkin);

    const casesJson = JSON.stringify(casesData, null, 4);
    const weaponSkinsJson = JSON.stringify(weaponSkinsData, null, 4);

    copyToClipboard(casesJson, weaponSkinsJson);
    alert("Data has been saved and copied to clipboard!");
}

function copyToClipboard(casesJson, weaponSkinsJson) {
    const combinedJson = `${casesJson}\n\n${weaponSkinsJson}`;

    navigator.clipboard.writeText(combinedJson).then(() => {
        console.log("Copied to clipboard");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

function clearFields() {
    document.getElementById("skinForm").reset();
}
