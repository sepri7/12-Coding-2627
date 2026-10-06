import { dataSty } from '@/styles/dataStyle';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { globalSty } from '../styles/globalStyle';

export default function app(){ 
    const [data,setData ] = useState([])
    const [nama, setNama] = useState("")
    const [dataId, setDataId] = useState(null)

    const API_LINK = "https://6wtxzzws-5000.asse.devtunnels.ms/pelajaran"
    const ambilData = async () => {
        try {
        const response = await fetch(
            API_LINK
        );
        const json = await response.json();
        setData(json.results || []); 
        } catch (e) {
        console.log(e);
        }
    };
    const addPelajaran = async () => {
        try {
            await fetch(API_LINK, {
            method : "POST",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({nama}),
        });
        setNama("")
        ambilData()
        }   catch(e){
    console.log("Error tambah:", e)
        }
    }

    const updatePelajaran = async (id) => {
        try {
            await fetch(`${API_LINK}/${id}`,{
                method : "PUT",
                headers : {"Content-type" : "application/json"},
                body : JSON.stringify({nama}),
            })
        } catch (error) {
            console.log("Error update:", error)
        }
    }


    const deletePelajaran = async (id) => {
        try {
            await fetch(`${API_LINK}/${id}`,{
                method : "DELETE"
            })
            ambilData()
        } catch (error) {
            console.log("Error DELETE:", error)
        }
    }
      useEffect(() => {
          ambilData();
         }, []);
    
    return(
        <View style={ globalSty.container }>
            <Text style={dataSty.headerTxt} >INPUT NAMA MAPEL</Text>
            <TextInput placeholder='EnterMapel' value={nama} onChangeText={setNama} style={{ borderColor:"#0b0b0b", padding:10, borderWidth:2,borderRadius:40, marginBottom:10 }} />
            
            <Button title='simpan' onPress={addPelajaran}  />

            <Text style={dataSty.headerTxt} >DATA MAPEL</Text>
            <FlatList 
                data={data}
                keyExtractor={(item,index) => index.toString()}
                renderItem={ ({item}) => (
                    <View style={dataSty.card}>
                        <Text style={{ fontWeight : 'bold' }}>{item.id} - {item.nama} </Text>
                        <Button title='Delete' onPress={ () => {
                            deletePelajaran(item.id)
                        }} />
                    </View>
                )}
            />
        </View>
    )
}