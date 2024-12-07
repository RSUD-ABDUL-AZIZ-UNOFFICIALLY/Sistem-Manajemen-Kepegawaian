require('dotenv').config();
// const jwt = require("jsonwebtoken");
// const axios = require("axios");
// const secretKey = process.env.SECRET_WA;
// const payload = {
//     gid: "Server Side",
// };

module.exports = {
    cekLocation(point) {
        let polygon = process.env.GEOLOCATION
        polygon = JSON.parse(polygon)
        let x = point[0], y = point[1];
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
        return inside;
    }


}