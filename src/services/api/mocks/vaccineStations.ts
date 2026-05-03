import { Locale, VaccineStation } from "../../../types/domain";

export type VaccineStationAddress = {
  country: string;
  region: string;
  street: string;
};

const STATIONS_BY_LOCALE: Record<Locale, VaccineStation[]> = {
  en: [
    {
      id: "station-en-1",
      name: "Riverside Children's Clinic",
      distanceLabel: "0.6 km",
      addressLine: "12 Riverside Ave",
      hours: "Mon-Fri 9:00-17:00"
    },
    {
      id: "station-en-2",
      name: "Maple Public Health Center",
      distanceLabel: "1.4 km",
      addressLine: "88 Maple Street",
      hours: "Mon-Sat 8:30-16:30"
    },
    {
      id: "station-en-3",
      name: "Harborview Pediatric Hub",
      distanceLabel: "2.1 km",
      addressLine: "5 Harborview Plaza",
      hours: "Tue-Sun 10:00-18:00"
    }
  ],
  zh: [
    {
      id: "station-zh-1",
      name: "滨河儿童诊所",
      distanceLabel: "0.6 公里",
      addressLine: "滨河大道 12 号",
      hours: "周一至周五 9:00-17:00"
    },
    {
      id: "station-zh-2",
      name: "枫树社区卫生服务中心",
      distanceLabel: "1.4 公里",
      addressLine: "枫树街 88 号",
      hours: "周一至周六 8:30-16:30"
    },
    {
      id: "station-zh-3",
      name: "海景儿科门诊部",
      distanceLabel: "2.1 公里",
      addressLine: "海景广场 5 号",
      hours: "周二至周日 10:00-18:00"
    }
  ],
  es: [
    {
      id: "station-es-1",
      name: "Clínica Infantil Ribera",
      distanceLabel: "0.6 km",
      addressLine: "Av. Ribera 12",
      hours: "Lun-Vie 9:00-17:00"
    },
    {
      id: "station-es-2",
      name: "Centro de Salud Arce",
      distanceLabel: "1.4 km",
      addressLine: "Calle Arce 88",
      hours: "Lun-Sáb 8:30-16:30"
    },
    {
      id: "station-es-3",
      name: "Pediatría Vista al Puerto",
      distanceLabel: "2.1 km",
      addressLine: "Plaza Vista al Puerto 5",
      hours: "Mar-Dom 10:00-18:00"
    }
  ],
  ja: [
    {
      id: "station-ja-1",
      name: "リバーサイド小児クリニック",
      distanceLabel: "0.6 km",
      addressLine: "リバーサイド大通 12",
      hours: "月-金 9:00-17:00"
    },
    {
      id: "station-ja-2",
      name: "メープル保健センター",
      distanceLabel: "1.4 km",
      addressLine: "メープル街 88",
      hours: "月-土 8:30-16:30"
    },
    {
      id: "station-ja-3",
      name: "ハーバービュー小児ハブ",
      distanceLabel: "2.1 km",
      addressLine: "ハーバービュー広場 5",
      hours: "火-日 10:00-18:00"
    }
  ]
};

export function getNearbyVaccineStations(
  _address: VaccineStationAddress,
  locale: Locale
): VaccineStation[] {
  return STATIONS_BY_LOCALE[locale];
}
