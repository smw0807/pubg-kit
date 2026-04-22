import { Inject } from '@nestjs/common';
import { PUBG_CLIENT } from './pubg.constants';

export const InjectPubgClient = (): ParameterDecorator => Inject(PUBG_CLIENT);
