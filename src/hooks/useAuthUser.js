import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, createTimestamp, db } from '../firebase'

export default function useAuthUser() {
  const [user] = useAuthState(auth)
  React.useEffect(() => {
    if (user) {
      const docRef = db.collection('users').doc(user.uid)
      docRef.get().then((snapshot) => {
        if (!snapshot.exists) {
          docRef.set({
            name: user.displayName,
            photoUrl: user.photoURL,
            timestamp: createTimestamp(),
          })
        }
      })
    }
  }, [user])
  return user
}
