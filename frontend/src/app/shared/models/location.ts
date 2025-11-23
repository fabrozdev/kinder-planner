export interface Location {
  id: string;
  name: string;
}

export interface CreateLocation extends Omit<Location, 'id'> {}
