---
version: 1.0
structure: locked
category: config
schema:
  daily_metrics:
    - id: weight
      name: Peso
      type: number
      unit: kg
      frequency: daily
      category: physical
    - id: sleep_hours
      name: Horas de sueño
      type: number
      unit: hours
      frequency: daily
      category: physical
    - id: exercise_completed
      name: Ejercicio completado
      type: boolean
      frequency: daily
      category: physical
    - id: exercise_minutes
      name: Minutos de ejercicio
      type: number
      unit: minutes
      frequency: daily
      category: physical
    - id: food_quality_score
      name: Calidad de alimentación
      type: number
      unit: score (1-5)
      frequency: daily
      category: physical
    - id: alcohol_consumed
      name: Alcohol consumido
      type: boolean
      frequency: daily
      category: habits
    - id: porn_consumed
      name: Pornografía consumida
      type: boolean
      frequency: daily
      category: habits
    - id: tobacco_consumed
      name: Tabaco consumido
      type: boolean
      frequency: daily
      category: habits
    - id: meditation_completed
      name: Meditación completada
      type: boolean
      frequency: daily
      category: habits
    - id: meditation_minutes
      name: Minutos de meditación
      type: number
      unit: minutes
      frequency: daily
      category: habits
    - id: stress_level
      name: Nivel de estrés
      type: number
      unit: score (1-10)
      frequency: daily
      category: emotional
    - id: energy_level
      name: Nivel de energía
      type: number
      unit: score (1-10)
      frequency: daily
      category: emotional
    - id: day_satisfaction
      name: Satisfacción del día
      type: number
      unit: score (1-10)
      frequency: daily
      category: emotional
  weekly_metrics:
    - id: body_fat
      name: Grasa corporal
      type: number
      unit: percentage
      frequency: weekly
      category: physical
    - id: waist_cm
      name: Cintura
      type: number
      unit: cm
      frequency: weekly
      category: physical
    - id: chest_cm
      name: Pecho
      type: number
      unit: cm
      frequency: weekly
      category: physical
    - id: arms_cm
      name: Brazos
      type: number
      unit: cm
      frequency: weekly
      category: physical
    - id: productive_hours
      name: Horas productivas
      type: number
      unit: hours
      frequency: weekly
      category: professional
    - id: projects_advanced
      name: Proyectos avanzados
      type: number
      unit: count
      frequency: weekly
      category: professional
  monthly_metrics:
    - id: income
      name: Ingreso mensual
      type: number
      unit: usd
      frequency: monthly
      category: financial
    - id: expenses
      name: Gastos mensuales
      type: number
      unit: usd
      frequency: monthly
      category: financial
    - id: savings
      name: Ahorro neto
      type: number
      unit: usd
      frequency: monthly
      category: financial
    - id: total_savings
      name: Balance total de ahorros
      type: number
      unit: usd
      frequency: monthly
      category: financial
    - id: debt
      name: Deuda total
      type: number
      unit: usd
      frequency: monthly
      category: financial
    - id: new_skills
      name: Skills nuevos aprendidos
      type: number
      unit: count
      frequency: monthly
      category: professional
    - id: certifications
      name: Certificaciones obtenidas
      type: number
      unit: count
      frequency: monthly
      category: professional
    - id: family_quality
      name: Calidad familiar
      type: number
      unit: score (1-10)
      frequency: monthly
      category: relationships
    - id: romantic_quality
      name: Calidad romántica
      type: number
      unit: score (1-10)
      frequency: monthly
      category: relationships
    - id: social_quality
      name: Calidad social
      type: number
      unit: score (1-10)
      frequency: monthly
      category: relationships
---

# Configuración de Tracking

Este archivo define QUÉ métricas se trackean y con qué frecuencia. La app lee este archivo para generar los formularios de entrada.

## 📊 Métricas Diarias (Mobile-First Quick Entry)

### Físico
- ✅ **Peso** (kg) - cada mañana
- ✅ **Horas de sueño** - al despertar
- ✅ **Hizo ejercicio hoy** (sí/no + minutos)
- ✅ **Calidad de alimentación** (1-5)

### Hábitos
- ✅ **Alcohol hoy** (sí/no)
- ✅ **Pornografía hoy** (sí/no)
- ✅ **Tabaco hoy** (sí/no)
- ✅ **Meditación hoy** (sí/no + minutos)

### Emocional
- ✅ **Nivel de estrés** (1-10)
- ✅ **Nivel de energía** (1-10)
- ✅ **Satisfacción del día** (1-10)

## 📅 Métricas Semanales (Domingos)

### Físico
- 📏 **Grasa corporal** (%) - con medidor
- 📏 **Circunferencias** (cintura, pecho, brazos) en cm

### Profesional
- 📈 **Horas productivas esta semana**
- 📈 **Proyectos avanzados**

## 📆 Métricas Mensuales (Día 1 de cada mes)

### Financiero
- 💰 **Ingreso del mes pasado**
- 💰 **Gastos del mes pasado**
- 💰 **Ahorro neto**
- 💰 **Balance total de ahorros**
- 💰 **Deuda total**

### Profesional
- 🎯 **Skills nuevos aprendidos**
- 🎯 **Certificaciones obtenidas**

### Relaciones
- ❤️ **Calidad familiar** (1-10)
- ❤️ **Calidad romántica** (1-10)
- ❤️ **Calidad social** (1-10)

---

**Nota:** Puedes ajustar estas métricas según tus necesidades. Si agregas/quitas una métrica, actualiza el schema en el frontmatter.
