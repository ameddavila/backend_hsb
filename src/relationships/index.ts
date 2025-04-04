import { associateBiometricoModels } from "./biometrico.relations";
import{initializeRelationships} from "./relationships"

export const setupAllRelationships = () => {
    initializeRelationships?.();      
    associateBiometricoModels();   // nuevo módulo
};
