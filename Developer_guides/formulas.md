# Fórmulas y cálculos del sistema DTS Frontend

> Documento de referencia técnica. Todas las fórmulas están implementadas en TypeScript dentro de los signals/computeds correspondientes.

---

## 1. Registro de tiempo muerto (`downtime-register.ts`)

### 1.1 Eficiencia de producción

$$\text{Eficiencia} = \left\lfloor \frac{\text{salidaActual}}{\text{salidaEstándar}} \times 100 \right\rfloor \%$$

- **`salidaActual`** — piezas producidas en el período (input del usuario).
- **`salidaEstándar`** — salida estándar definida para la etapa/línea.
- Retorna `0` si `salidaActual` es nulo o `salidaEstándar === 0`.

---

### 1.2 Tiempo calculado de producción

$$\text{tiempoCalculado} = \left\lfloor \frac{\text{salidaActual} \times 60}{\text{salidaEstándar}} \right\rfloor \text{ min}$$

Convierte las piezas producidas a minutos equivalentes de operación.

---

### 1.3 Tiempo esperado del rango

$$\text{tiempoEsperado} = (\text{endHour} - \text{startHour}) \times 60 \text{ min}$$

Obtenido del `IHourlyStandard` activo para la hora de inicio del registro.  
Si no existe estándar para esa hora, se asume un rango de **1 hora (60 min)**.

---

### 1.4 Tiempo muerto generado

$$\text{DT\_generado} = \left|\min\!\left(0,\ \text{tiempoCalculado} - \text{tiempoEsperado}\right)\right|$$

Solo hay tiempo muerto cuando `tiempoCalculado < tiempoEsperado`. El `MIN(0, ...)` garantiza que valores positivos (producción adelantada) resulten en `0`.

---

### 1.5 Tiempo muerto no reportado

$$\text{DT\_noReportado} = \left|\min\!\left(0,\ \lfloor \text{DT\_reportado} - \text{DT\_generado} \rfloor\right)\right|$$

Mide la brecha entre el tiempo muerto que debería haberse reportado y el que realmente se registró en clasificaciones.

---

## 2. Dashboard / Home (`home.ts`)

### 2.1 Delta porcentual de tiempo muerto (semana vs. semana anterior)

$$\Delta_{DT} = \left\lfloor \frac{\text{DT\_actual} - \text{DT\_anterior}}{\text{DT\_anterior}} \times 100 \right\rfloor \%$$

Positivo = empeoró, negativo = mejoró. Retorna `0` si `DT_anterior === 0`.

---

### 2.2 Porcentaje de barra de DT total

$$\text{dtBarPct} = \min\!\left(100,\ \left\lfloor \frac{\text{DT\_total}}{600} \times 100 \right\rfloor\right)$$

El divisor `600` es el valor de referencia máximo esperado (600 minutos).

---

### 2.3 MTTR — Tiempo medio de reparación

$$\text{MTTR} = \left\lfloor \frac{\sum \text{DT\_total}}{\text{nº incidentes}} \right\rfloor \text{ min/incidente}$$

Retorna `0` si no hay incidentes registrados.

---

### 2.4 Porcentaje de barra de MTTR

$$\text{mttrBarPct} = \min\!\left(100,\ \left\lfloor \frac{\text{MTTR}}{120} \times 100 \right\rfloor\right)$$

El divisor `120` es el valor de referencia máximo (120 min).

---

### 2.5 MTBF — Tiempo medio entre fallos

$$\text{MTBF} = \frac{\text{tiempoActivo}}{\text{nº incidentes} \times 60} \text{ h}$$

Donde:

$$\text{tiempoActivo} = \max\!\left(0,\ \text{ventanaTotal} - \text{DT\_total}\right)$$

$$\text{ventanaTotal} = \text{nº horas en heatmap} \times 60 \text{ min} \quad (\text{default: } 168 \times 60)$$

---

### 2.6 Porcentaje de barra de MTBF

$$\text{mtbfBarPct} = \min\!\left(100,\ \left\lfloor \frac{\text{MTBF}}{200} \times 100 \right\rfloor\right)$$

El divisor `200` es el valor de referencia máximo (200 horas).

---

### 2.7 Disponibilidad del sistema

$$\text{Disponibilidad} = \frac{\text{tiempoActivo}}{\text{ventanaTotal}} \times 100 \%$$

$$\text{tiempoActivo} = \max\!\left(0,\ \text{ventanaTotal} - \text{DT\_total}\right)$$

---

## 3. Reporte por hora (`reports.ts`)

### 3.1 Totales de turno

| Métrica | Fórmula |
|---|---|
| Salida estándar acumulada | $\sum r.\text{standard}$ |
| Producción acumulada | $\sum r.\text{production}$ |
| DT generado acumulado | $\sum r.\text{dtGenerated}$ |
| DT no reportado acumulado | $\sum r.\text{dtNotReported}$ |

---

### 3.2 Eficiencia promedio del turno

$$\overline{\text{Eficiencia}} = \frac{\sum_{r} r.\text{efficiency}}{N} \%$$

Promedio aritmético de las eficiencias por hora. Retorna `0` si no hay registros.

---

### 3.3 Porcentaje relativo por departamento (top 3)

$$\text{pct}_{i} = \left\lfloor \frac{\text{DT}_{i}}{\text{DT}_{\max}} \times 100 \right\rfloor$$

Donde `DT_max` es el tiempo muerto del primer departamento en el ranking.  
Se muestran los **3 departamentos con mayor DT acumulado**.

---

## 4. Tendencias semanales (`trends.ts`)

### 4.1 Ancho de barra relativo por semana

$$\text{barWidth}(DT) = \left\lfloor \frac{DT}{\max(\text{semanas})} \times 100 \right\rfloor \%$$

---

### 4.2 KPI de tendencia semana current vs. anterior

$$\Delta_{\text{semanal}} = \frac{\text{DT\_semanaActual} - \text{DT\_semanaAnterior}}{\text{DT\_semanaAnterior}} \times 100 \%$$

Retorna `0.0` si `DT_semanaAnterior === 0`.  
`up: true` indica incremento (más tiempo muerto = peor).

---

### 4.3 Clasificación de tendencia por causa

| Condición | Tendencia |
|---|---|
| $\text{DT\_actual} > \text{DT\_anterior} + 5$ | `up` (empeoró) |
| $\text{DT\_actual} < \text{DT\_anterior} - 5$ | `down` (mejoró) |
| $|\Delta| \leq 5$ | `stable` |

El umbral de `±5 minutos` evita falsos positivos por variación menor.

---

## 5. Predicciones IA (`ai-insights.ts`)

### 5.1 DT promedio por ocurrencia de departamento

$$\overline{DT}_{dept} = \left\lfloor \frac{\sum DT_{dept}}{\text{ocurrencias}_{dept}} \right\rfloor \text{ min}$$

---

### 5.2 Ratio de frecuencia

$$freqRatio = \frac{\text{ocurrencias}_{dept}}{\text{total clasificaciones}}$$

---

### 5.3 Ratio de tiempo muerto

$$dtRatio = \frac{\sum DT_{dept}}{\sum DT_{\text{total}}}$$

---

### 5.4 Probabilidad de reincidencia

$$P = \min\!\left(95,\ \left\lfloor freqRatio \times 80 + dtRatio \times 60 + 10 \right\rfloor\right) \%$$

Los coeficientes `80` y `60` son pesos calibrados que balancean la frecuencia con la severidad.  
El `+10` garantiza un piso mínimo de probabilidad.  
El techo es `95%` para evitar certezas absolutas.

---

### 5.5 Nivel de riesgo

| DT acumulado del departamento | Nivel |
|---|---|
| $\geq 30$ min | `critical` |
| $\geq 15$ min | `high` |
| $\geq 8$ min | `medium` |
| $< 8$ min | `low` |

---

### 5.6 Precisión del modelo

$$\text{Precisión} = \min\!\left(95,\ \left\lfloor \frac{\text{registros con ≥ 1 clasificación}}{\text{total registros}} \times 55 + 40 \right\rfloor\right) \%$$

- **Piso**: `40%` — garantizado aunque no haya datos clasificados.
- **Techo**: `95%` — nunca presenta el modelo como perfecto.
- La completitud al `100%` resulta en `95%` → $0 + 55 + 40 = 95$.

---

## 6. Utilidad de fechas (`date.helper.ts`)

### 6.1 Tiempo relativo desde una fecha

$$\Delta_{ms} = t_{ahora} - t_{fecha}$$

$$\Delta_{min} = \left\lfloor \frac{\Delta_{ms}}{60000} \right\rfloor$$

$$\Delta_{h} = \left\lfloor \frac{\Delta_{min}}{60} \right\rfloor$$

$$\Delta_{días} = \left\lfloor \frac{\Delta_{h}}{24} \right\rfloor$$

---

## 7. Función utilitaria `fmtMins`

Usada en múltiples módulos para formatear minutos a texto legible:

$$\text{fmtMins}(m) = \begin{cases} \text{``0m''} & m = 0 \\ \text{``\{m\}m''} & h = 0 \\ \text{``\{h\}h''} & m \bmod 60 = 0 \\ \text{``\{h\}h \{m \bmod 60\}m''} & \text{en otro caso} \end{cases}$$

Donde $h = \lfloor m / 60 \rfloor$.

---

*Generado el 18 de marzo de 2026 — DTS Frontend v21*
