const concatLogs = logs => {
  const result = {}
  logs.forEach(day => {
    const newDay = {
      duration: day.duration,
      description: day.description || 'Not specified',
    }
    result[day.day] = result[day.day] ? [...result[day.day], newDay] : [newDay]
  })
  return result
}

export const handleData = dataObject =>
  Object.keys(dataObject).map(weekKey =>
    dataObject[weekKey].map(employee => {
      const logs = concatLogs(employee.logs)
      return {
        key: Math.round(Math.random() * 100),
        name: employee.fullname,
        mon: logs[1],
        tue: logs[2],
        wed: logs[3],
        thu: logs[4],
        fri: logs[5],
      }
    }),
  )
