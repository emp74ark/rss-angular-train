import { StationData } from '../../models/search';

export interface UserTrip {
  from: StationData;
  to: StationData;
  routeId: number;
  rideId: number;
  startTime: string;
  endTime: string;
  duration: string;
  routeStartCityName: string;
  routeEndCityName: string;
  carriage: CarriageInfo[];
}

export interface CarriageInfo {
  type: string;
  name: string;
  price: number;
  seatsAvailable: number;
}

export interface TripResponse {
  [data: string]: UserTrip[];
}

export const dates = [
  '2024-09-10',
  '2024-09-11',
  '2024-09-13',
  '2024-09-15',
  '2024-09-16',
  '2024-09-20',
  '2024-09-28',
  '2024-09-29',
  '2024-10-01',
  '2024-10-10',
];

export const tripInfo: TripResponse = {
  '2024-09-10': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-10T15:22:34.415Z',
      endTime: '2024-10-07T08:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city45',
      routeEndCityName: 'city53',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 151,
      rideId: 170,
      startTime: '2024-09-10T17:22:34.415Z',
      endTime: '2024-10-08T18:40:34.415Z',
      duration: '12h 48 min',
      routeStartCityName: 'city6',
      routeEndCityName: 'city31',
      carriage: [
        { type: 'carriage6', name: 'carriage6', price: 12489, seatsAvailable: 56 },
        { type: 'carriage12', name: 'carriage12', price: 19, seatsAvailable: 44406 },
        { type: 'carriage20', name: 'carriage20', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-09-11': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 151,
      rideId: 1770,
      startTime: '2024-09-11T05:22:34.415Z',
      endTime: '2024-10-12T12:14:34.415Z',
      duration: '12d 2h',
      routeStartCityName: 'city13',
      routeEndCityName: 'city32',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-11T09:22:34.415Z',
      endTime: '2024-11-17T23:04:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city45',
      routeEndCityName: 'city53',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
        { type: 'carriage12', name: 'carriage12', price: 229, seatsAvailable: 1890 },
        { type: 'carriage30', name: 'carriage30', price: 478, seatsAvailable: 60 },
      ],
    },
  ],
  '2024-09-13': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 2,
      rideId: 340,
      startTime: '2024-09-11T19:45:34.415Z',
      endTime: '2024-09-23T08:40:34.415Z',
      duration: '12d 2h',
      routeStartCityName: 'city3',
      routeEndCityName: 'city23',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
      ],
    },
  ],
  '2024-09-15': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-15T05:22:34.415Z',
      endTime: '2024-10-01T08:40:34.415Z',
      duration: '3d 12h 43min',
      routeStartCityName: 'city6',
      routeEndCityName: 'city44',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-15T15:22:34.415Z',
      endTime: '2024-09-23T08:40:34.415Z',
      duration: '2d 6h 34min',
      routeStartCityName: 'city45',
      routeEndCityName: 'city53',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
        { type: 'carriage24', name: 'carriage24', price: 165, seatsAvailable: 486 },
        { type: 'carriage42', name: 'carriage42', price: 678, seatsAvailable: 32 },
        { type: 'carriage38', name: 'carriage38', price: 3245, seatsAvailable: 567 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-15T13:32:34.415Z',
      endTime: '2024-10-21T12:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city18',
      routeEndCityName: 'city22',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-09-16': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-16T16:00:34.415Z',
      endTime: '2024-10-07T17:40:34.415Z',
      duration: '12d 2h',
      routeStartCityName: 'city23',
      routeEndCityName: 'city4',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-09-20': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 50,
      rideId: 43,
      startTime: '2024-09-15T15:22:34.415Z',
      endTime: '2024-09-18T08:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city6',
      routeEndCityName: 'city33',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-09-28': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-28T07:22:34.415Z',
      endTime: '2024-10-04T08:40:34.415Z',
      duration: '8d 2h',
      routeStartCityName: 'city3',
      routeEndCityName: 'city13',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-28T06:54:34.415Z',
      endTime: '2024-10-09T14:37:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city9',
      routeEndCityName: 'city25',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-09-28T06:22:34.415Z',
      endTime: '2024-10-07T19:44:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city9',
      routeEndCityName: 'city25',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 77,
      rideId: 678,
      startTime: '2024-09-28T23:22:34.415Z',
      endTime: '2024-10-07T14:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city17',
      routeEndCityName: 'city47',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-09-29': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 98,
      rideId: 65,
      startTime: '2024-09-29T15:38:34.415Z',
      endTime: '2024-10-21T18:41:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city46',
      routeEndCityName: 'city7',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-10-01': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-10-01T10:07:34.415Z',
      endTime: '2024-10-14T13:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city8',
      routeEndCityName: 'city50',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
  '2024-10-10': [
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 6,
      rideId: 148,
      startTime: '2024-10-10T16:22:34.415Z',
      endTime: '2024-10-27T05:49:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city3',
      routeEndCityName: 'city27',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-10-10T15:22:34.415Z',
      endTime: '2024-10-18T08:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city7',
      routeEndCityName: 'city28',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-10-10T11:22:34.415Z',
      endTime: '2024-10-07T20:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city9',
      routeEndCityName: 'city31',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 51,
      rideId: 177,
      startTime: '2024-10-10T15:22:34.415Z',
      endTime: '2024-11-01T08:40:34.415Z',
      duration: '2d 2h',
      routeStartCityName: 'city37',
      routeEndCityName: 'city43',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
    {
      from: {
        city: 'city1',
        geolocation: { latitude: -89.86645326499733, longitude: -41.370329157492506 },
        stationId: 1,
      },
      to: {
        city: 'city2',
        geolocation: { latitude: 61.96174756259191, longitude: 94.15062062887125 },
        stationId: 2,
      },
      routeId: 11,
      rideId: 5346,
      startTime: '2024-10-10T16:22:34.415Z',
      endTime: '2024-11-03T22:22:34.415Z',
      duration: '22d 2h',
      routeStartCityName: 'city20',
      routeEndCityName: 'city2',
      carriage: [
        { type: 'carriage5', name: 'carriage5', price: 2489, seatsAvailable: 98 },
        { type: 'carriage4', name: 'carriage4', price: 719, seatsAvailable: 4406 },
        { type: 'carriage2', name: 'carriage2', price: 1865, seatsAvailable: 406 },
        { type: 'carriage1', name: 'carriage1', price: 2229, seatsAvailable: 890 },
        { type: 'carriage3', name: 'carriage3', price: 2478, seatsAvailable: 6 },
      ],
    },
  ],
};
