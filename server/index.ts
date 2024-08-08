import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { MarkerType } from '@Shared/types/marker.js';
import { Vehicle } from '@Shared/types/vehicle.js';
import { exit } from 'process';
import { useWebview } from '@Server/player/webview.js'
import { DealerEventNames } from '../shared/event.js';
import { useTranslate } from '@Shared/translate.js';
import { DealerConfig } from '../shared/config.js';
import { DealerSlot } from '../shared/types.js';



const Rebar = useRebar();
const db = Rebar.database.useDatabase();
const { t } = useTranslate(DealerConfig.translate);
const RebarEvents = Rebar.events.useEvents();



let dealerSlot : DealerSlot = {
    slot : 2,
    vehicle : null,
    position : new alt.Vector3(DealerConfig.slotPosition.x, DealerConfig.slotPosition.y, DealerConfig.slotPosition.z),
    rotation : new alt.Vector3(DealerConfig.rotation.x, DealerConfig.rotation.y, DealerConfig.rotation.z)
};


const init = () => {
    const dealerPosition = new alt.Vector3(DealerConfig.blipPosition.x, DealerConfig.blipPosition.y,DealerConfig.blipPosition.z);


    const interaction = Rebar.controllers.useInteraction(
        new alt.ColshapeCylinder(dealerPosition.x, dealerPosition.y, dealerPosition.z, 3, 3),
        'player',
    );


    interaction.on(async (player) => {
        player.frozen = true;

        await alt.Utils.wait(1000);

        const rPlayer = Rebar.usePlayer(player);

        rPlayer.player.pos = new alt.Vector3(-790.5, -240.7, 38.08101);
        player.visible = false;

        await alt.Utils.wait(2000);
        rPlayer.world.freezeCamera(true);



        spawnVehicle("nero2", dealerSlot);
        showMenu(player);
    });

    Rebar.controllers.useMarkerGlobal({
        pos: dealerPosition,
        color: new alt.RGBA(200, 162, 200, 75),
        scale: new alt.Vector3(3, 3, 1),
        type: MarkerType.CYLINDER,
    });

    Rebar.controllers.useTextLabelGlobal({
        pos: dealerPosition.add(0, 0, 1),
        text: 'Press E to access the garage!',
    });


    Rebar.controllers.useBlipGlobal({
        color: 7,
        pos: dealerPosition,
        shortRange: false,
        sprite: 523,
        text: 'Dealership',
    });

    const exitInteraction = Rebar.controllers.useInteraction(
        new alt.ColshapeCylinder(-792.568, -232.5022, 36.734, 3, 3),
        'player',
    );


    exitInteraction.on((player) => {
        const rPlayer = Rebar.usePlayer(player);
        rPlayer.notify.showNotification('Pressed E to exit!');
        player.pos = new alt.Vector3(-793.5711, -246.7982, 36.08101)
    });


    Rebar.controllers.useMarkerGlobal({
        pos: new alt.Vector3(-792.568, -232.5022, 36.734),
        color: new alt.RGBA(200, 162, 200, 75),
        scale: new alt.Vector3(3, 3, 1),
        type: MarkerType.CYLINDER,
    });

    Rebar.controllers.useTextLabelGlobal({
        pos: new alt.Vector3(-792.568, -232.5022, 36.734).add(0, 0, 1),
        text: 'Press E to access the garage!',
    });

 

    spawnVehicle("adder", dealerSlot);
}
init();

function spawnVehicle(model : string, slot : DealerSlot)  {
    if (slot === null)
        return;

    if (slot.vehicle !== null)
        slot.vehicle.destroy();


    const newVehicle = new alt.Vehicle(model, slot.position, slot.rotation);
    const veh = Rebar.vehicle.useVehicle(newVehicle);
    slot.vehicle = veh.vehicle;

}


function showMenu(player : alt.Player) {
    const webview = Rebar.player.useWebview(player);

    webview.show('DealerView', 'page');
    webview.emit(DealerEventNames.toWebview.showVehicle, DealerConfig.vehicleGategories);
}


alt.onRpc(DealerEventNames.toServer.selectVehicle, (player, model) => {
    spawnVehicle(model, dealerSlot);
})


alt.onRpc(DealerEventNames.toServer.changeVehicleColor, (player, primaryColor, secondaryColor) => {
    dealerSlot.vehicle.primaryColor = primaryColor;
    dealerSlot.vehicle.secondaryColor = secondaryColor;
})


alt.onRpc(DealerEventNames.toServer.buyVehicle, (player) => {
    const rPlayer = Rebar.usePlayer(player);

    player.frozen = false;
    player.visible = true;
    rPlayer.world.freezeCamera(false);

    let vehicleCopy = dealerSlot.vehicle;
    let getVehicleSpawnPoint = DealerConfig.vehicleSpawnAfterBuy[Math.floor(Math.random() * DealerConfig.vehicleSpawnAfterBuy.length)];
    vehicleCopy.pos = new alt.Vector3(getVehicleSpawnPoint.pos.x, getVehicleSpawnPoint.pos.y, getVehicleSpawnPoint.pos.z);
    vehicleCopy.rot = new alt.Vector3(getVehicleSpawnPoint.rot.x, getVehicleSpawnPoint.rot.y, getVehicleSpawnPoint.rot.z);
    player.setIntoVehicle(vehicleCopy, 1);
    Rebar.vehicle.useVehicle(dealerSlot.vehicle).create(rPlayer.account.get()._id);

    const webview = Rebar.player.useWebview(player);
    webview.hide('DealerView');
})

