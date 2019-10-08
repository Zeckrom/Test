import { notification } from 'antd'

export const pushNotification = (
  type,
  title,
  description,
  callBack = () => null,
) => {
  notification[type]({
    message: title,
    description,
    onClick: () => {
      callBack()
    },
  })
}
