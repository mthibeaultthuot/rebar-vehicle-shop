import * as alt from 'alt-server';


export interface DealerSlot {
    slot : number;
    vehicle: alt.Vehicle;
    position : alt.Vector3;
    rotation : alt.Vector3;
}
