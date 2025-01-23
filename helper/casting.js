require('dotenv').config();
const {
    Location
} = require("../models");

module.exports = {
    async cekLocation(point) {
        let getGeo = await Location.findAll();
        for (let z of getGeo) {
            let polygon = JSON.parse(z.geo);
            let y = point[0], x = point[1];
            let inside = false;

            // Iterasi melalui setiap sisi poligon
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                let xi = polygon[i][0], yi = polygon[i][1];
                let xj = polygon[j][0], yj = polygon[j][1];

                // Hitung apakah garis horizontal dari titik memotong sisi poligon
                let intersect = ((yi > y) != (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            console.log(inside)
            if (inside) {
                let data = {
                    location: z.location,
                    status: true
                }
                return data
            }
            // return inside;
        }
        let data = {
            location: "Tidak di lokasi",
            status: false
        }
        return data
    }


}