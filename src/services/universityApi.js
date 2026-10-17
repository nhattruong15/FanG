/**
 * Service to fetch and manage Universities and Colleges in Vietnam
 * Integrates external API (hipolabs university-domains-list) with a curated list
 * of Vietnamese Universities & Colleges (Đại học & Cao đẳng tại Việt Nam).
 */

export const VIETNAM_UNIVERSITIES_FALLBACK = [
  // Miền Bắc
  { id: 'fpt-hn', name: 'Trường Đại học FPT Hà Nội', shortName: 'ĐH FPT Hà Nội', region: 'Miền Bắc', type: 'Đại học', code: 'FPT' },
  { id: 'bkhn', name: 'Trường Đại học Bách Khoa Hà Nội', shortName: 'ĐH Bách Khoa HN', region: 'Miền Bắc', type: 'Đại học', code: 'BKA' },
  { id: 'neu', name: 'Trường Đại học Kinh Tế Quốc Dân', shortName: 'ĐH Kinh Tế QD', region: 'Miền Bắc', type: 'Đại học', code: 'KQT' },
  { id: 'vnu-hn', name: 'Đại học Quốc Gia Hà Nội', shortName: 'ĐH Quốc Gia HN', region: 'Miền Bắc', type: 'Đại học', code: 'QGH' },
  { id: 'ptit', name: 'Học viện Công nghệ Bưu chính Viễn thông', shortName: 'Học viện Bưu Chính', region: 'Miền Bắc', type: 'Đại học', code: 'BVH' },
  { id: 'ftu-hn', name: 'Trường Đại học Ngoại Thương Hà Nội', shortName: 'ĐH Ngoại Thương HN', region: 'Miền Bắc', type: 'Đại học', code: 'NTH' },
  { id: 'hanu', name: 'Trường Đại học Hà Nội', shortName: 'ĐH Hà Nội', region: 'Miền Bắc', type: 'Đại học', code: 'NHN' },
  { id: 'hnue', name: 'Trường Đại học Sư Phạm Hà Nội', shortName: 'ĐH Sư Phạm HN', region: 'Miền Bắc', type: 'Đại học', code: 'SPH' },
  { id: 'tlu', name: 'Trường Đại học Thủy Lợi', shortName: 'ĐH Thủy Lợi', region: 'Miền Bắc', type: 'Đại học', code: 'TLA' },
  { id: 'utc', name: 'Trường Đại học Giao Thông Vận Tải', shortName: 'ĐH Giao Thông Vận Tải', region: 'Miền Bắc', type: 'Đại học', code: 'GHA' },
  { id: 'fpt-poly-hn', name: 'Trường Cao đẳng FPT Polytechnic Hà Nội', shortName: 'CĐ FPT Poly HN', region: 'Miền Bắc', type: 'Cao đẳng', code: 'FPOLY_HN' },

  // Miền Nam
  { id: 'fpt-hcm', name: 'Trường Đại học FPT TP.HCM', shortName: 'ĐH FPT TP.HCM', region: 'Miền Nam', type: 'Đại học', code: 'FPT_HCM' },
  { id: 'bkhcm', name: 'Trường Đại học Bách Khoa TP.HCM', shortName: 'ĐH Bách Khoa HCM', region: 'Miền Nam', type: 'Đại học', code: 'QSB' },
  { id: 'hutech', name: 'Trường Đại học Công Nghệ TP.HCM (HUTECH)', shortName: 'ĐH HUTECH', region: 'Miền Nam', type: 'Đại học', code: 'DKH' },
  { id: 'tdtu', name: 'Trường Đại học Tôn Đức Thắng', shortName: 'ĐH Tôn Đức Thắng', region: 'Miền Nam', type: 'Đại học', code: 'DTT' },
  { id: 'vlu', name: 'Trường Đại học Văn Lang', shortName: 'ĐH Văn Lang', region: 'Miền Nam', type: 'Đại học', code: 'DVL' },
  { id: 'hsu', name: 'Trường Đại học Hoa Sen', shortName: 'ĐH Hoa Sen', region: 'Miền Nam', type: 'Đại học', code: 'HSU' },
  { id: 'ueh', name: 'Trường Đại học Kinh Tế TP.HCM (UEH)', shortName: 'ĐH Kinh Tế HCM', region: 'Miền Nam', type: 'Đại học', code: 'KSA' },
  { id: 'ute', name: 'Trường Đại học Sư Phạm Kỹ Thuật TP.HCM', shortName: 'ĐH SP Kỹ Thuật HCM', region: 'Miền Nam', type: 'Đại học', code: 'SPK' },
  { id: 'dtu', name: 'Trường Đại học Duy Tân (Đà Nẵng)', shortName: 'ĐH Duy Tân', region: 'Miền Nam', type: 'Đại học', code: 'DDT' },
  { id: 'ctu', name: 'Trường Đại học Cần Thơ', shortName: 'ĐH Cần Thơ', region: 'Miền Nam', type: 'Đại học', code: 'TCT' },
  { id: 'fpt-poly-hcm', name: 'Trường Cao đẳng FPT Polytechnic TP.HCM', shortName: 'CĐ FPT Poly HCM', region: 'Miền Nam', type: 'Cao đẳng', code: 'FPOLY_HCM' },
  { id: 'caothang', name: 'Trường Cao đẳng Kỹ thuật Cao Thắng', shortName: 'CĐ Kỹ Thuật Cao Thắng', region: 'Miền Nam', type: 'Cao đẳng', code: 'CKT' },
  { id: 'lytutrong', name: 'Trường Cao đẳng Lý Tự Trọng', shortName: 'CĐ Lý Tự Trọng', region: 'Miền Nam', type: 'Cao đẳng', code: 'LTT' }
];

/**
 * Fetch Vietnam Universities & Colleges from Vansao OpenAPI / Hipolabs API and merge with curated fallback list.
 */
export async function fetchVietnamUniversities() {
  try {
    // Primary API Source: Vansao Vietnam Schools OpenAPI (via Vite proxy to bypass CORS)
    const response = await fetch('/api/vansao/schools');
    if (response.ok) {
      const apiData = await response.json();
      if (Array.isArray(apiData) && apiData.length > 0) {
        const formattedData = apiData.map((item, index) => {
          const isCollege = item.name.toLowerCase().includes('cao đẳng') || (item.code && item.code.toLowerCase().includes('cđ'));
          
          // Infer region from campuses address or name
          const campusAddress = item.campuses && item.campuses[0] && item.campuses[0].address ? item.campuses[0].address.toLowerCase() : '';
          const isNorth = campusAddress.includes('hà nội') || campusAddress.includes('thái nguyên') || campusAddress.includes('bắc') ||
            item.name.toLowerCase().includes('hà nội') || item.name.toLowerCase().includes('bắc');
          const region = isNorth ? 'Miền Bắc' : 'Miền Nam';

          return {
            id: item.id || `vansao_${index}`,
            code: item.code || '',
            name: item.name,
            shortName: item.code || item.name,
            region: region,
            type: isCollege ? 'Cao đẳng' : (item.type === 'public' ? 'Đại học Công lập' : 'Đại học Tư thục'),
            website: item.contact?.website || '',
            faculties: item.faculties || [],
            isFromApi: true,
            apiSource: 'Vansao OpenAPI'
          };
        });

        // Start with all API schools from Vansao OpenAPI
        const combined = [...formattedData];

        // Add local fallback schools ONLY if they are not already in the API list (strict normalized check)
        VIETNAM_UNIVERSITIES_FALLBACK.forEach(localItem => {
          const normLocal = localItem.name.toLowerCase().trim();
          const normShort = localItem.shortName ? localItem.shortName.toLowerCase().trim() : '';
          
          const exists = combined.some(api => {
            const normApi = api.name.toLowerCase().trim();
            const normApiShort = api.shortName ? api.shortName.toLowerCase().trim() : '';
            return normApi === normLocal || (normShort && normApiShort === normShort);
          });

          if (!exists) {
            combined.push(localItem);
          }
        });

        return combined;
      }
    }

    // Secondary API Source Fallback: Hipolabs API
    const hipoResponse = await fetch('https://universities.hipolabs.com/search?country=Vietnam');
    if (hipoResponse.ok) {
      const hipoData = await hipoResponse.json();
      const formattedHipo = hipoData.map((item, index) => ({
        id: `hipo_${index}`,
        name: item.name,
        shortName: item.name,
        region: item.name.toLowerCase().includes('hanoi') ? 'Miền Bắc' : 'Miền Nam',
        type: item.name.toLowerCase().includes('college') ? 'Cao đẳng' : 'Đại học',
        isFromApi: true,
        apiSource: 'Hipolabs API'
      }));

      const combined = [...VIETNAM_UNIVERSITIES_FALLBACK];
      formattedHipo.forEach(apiItem => {
        const exists = combined.some(local => local.name.toLowerCase().includes(apiItem.name.toLowerCase()));
        if (!exists) combined.push(apiItem);
      });
      return combined;
    }

    return VIETNAM_UNIVERSITIES_FALLBACK;
  } catch (err) {
    console.warn('Unable to reach external Vietnam Universities API, utilizing curated list fallback:', err.message);
    return VIETNAM_UNIVERSITIES_FALLBACK;
  }
}
