import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useMemo,
} from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { Container, Content, AvatarInput, Row, ContentForm } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import MyAutocomplete from '../../components/MyAutocomplete';
import Button from '../../components/Button';

interface Member {
  id: string;
  name: string;
  date_of_birth: string;
  date_of_birth_formatted: string;
  nationality: string;
  document: string;
  sexy: string;
  marital_status: string;
  spouse_name: string;
  wedding_date: string;
  wedding_date_formatted: string;
  fathers_name: string;
  mothers_name: string;
  email: string;
  telephone: string;
  cell_phone: string;
  postal_code: string;
  address: string;
  address_formatted: string;
  state: string;
  city: string;
  country: string;
  neighborhood: string;
  coming_church: string;
  religious_formation: string;
  baptism_church: string;
  baptism_date: string;
  baptism_date_formatted: string;
  education_level: string;
  course: string;
  profession: string;
  avatar_url: string;
}

const SaveMember: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const location = useLocation();
  const id = location.search.replace('?id=', '');

  const members = useMemo<Member[]>(() => {
    const saved_members = localStorage.getItem('@Church:members');

    if (saved_members !== null) {
      return JSON.parse(saved_members) as Member[];
    }
    return [] as Member[];
  }, []);

  const optionsMaritalStatus = useMemo(() => {
    return ['Solteiro', 'Casado', 'Separado', 'Viúvo'];
  }, []);

  const member = useMemo<Member>(() => {
    if (members.length > 0) {
      const formMember = members.filter(_member => _member.id.toString() === id)[0];
      if (formMember) {
        return formMember;
      }
    }
    return {} as Member;
  }, [members, id]);

  const loading = useMemo(() => {
    if (id === '' || (id !== '' && member.id !== undefined)) {
      return false;
    }
    return true;
  }, [member, id]);

  const optionsSexy = useMemo(() => {
    return ['F', 'M'];
  }, []);

  const optionsCity = useMemo(() => {
    const options = members.filter(_member => _member.city);

    if(options.length > 0) {
      return options.map(_member => _member.city).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsAddress = useMemo(() => {
    const options = members.filter(_member => _member.address);

    if(options.length > 0) {
      return options.map(_member => _member.address).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsPostal = useMemo(() => {
    const options = members.filter(_member => _member.postal_code);

    if(options.length > 0) {
      return options.map(_member => _member.postal_code).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsCountry = useMemo(() => {
    const options = members.filter(_member => _member.country);

    if(options.length > 0) {
      return options.map(_member => _member.country).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsState = useMemo(() => {
    const options = members.filter(_member => _member.state);

    if(options.length > 0) {
      return options.map(_member => _member.state).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsNeighborhood = useMemo(() => {
    const options = members.filter(_member => _member.neighborhood);

    if(options.length > 0) {
      return options.map(_member => _member.neighborhood).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsNationality = useMemo(() => {

    const options = members.filter(_member => _member.nationality);

    if(options.length > 0) {
      return options.map(_member => _member.nationality).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsChurch = useMemo(() => {
    if(members.length === 0) {
      return [];
    }

    const options = members.filter(_member => _member.coming_church);

    if(options.length > 0) {
      return options.map(_member => _member.coming_church).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsFormation = useMemo(() => {
    if(members.length === 0) {
      return [];
    }

    const formations = members.filter(_member => _member.religious_formation);

    if(formations.length > 0) {
      return formations.map(_member => _member.religious_formation).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsEducation = useMemo(() => {
    const options = members.filter(_member => _member.education_level);

    if(options.length > 0) {
      return options.map(_member => _member.education_level).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsCourse = useMemo(() => {
    const options = members.filter(_member => _member.course);

    if(options.length > 0) {
      return options.map(_member => _member.course).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsProfession = useMemo(() => {
    const options = members.filter(_member => _member.profession);

    if(options.length > 0) {
      return options.map(_member => _member.profession).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members]);

  const optionsSpouseName = useMemo(() => {
    const options = members.filter(_member => _member.sexy && _member.sexy !== member.sexy);

    if(options.length > 0) {
      return options.map(_member => _member.name).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members, member.sexy]);

  const optionsMenName = useMemo(() => {
    const options = members.filter(_member => _member.sexy === 'M' && _member.id !== member.id);

    if(options.length > 0) {
      return options.map(_member => _member.name).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members, member.id]);


  const optionsWomenName = useMemo(() => {
    const options = members.filter(_member => _member.sexy === 'F' && _member.id !== member.id);

    if(options.length > 0) {
      return options.map(_member => _member.name).filter((value, index, self) => self.indexOf(value) === index);
    }

    return [];
  }, [members, member.id]);

  const handleUpdateAvatarMember = useCallback((avatar_url:string) => {
    member.avatar_url = avatar_url;
  },[member]);

  const handleSubmitMember = useCallback(
    async (data: Member) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          ...data,
          date_of_birth: data.date_of_birth_formatted.split("/").reverse().join("-"),
          wedding_date: data.wedding_date_formatted.split("/").reverse().join("-"),
          baptism_date: data.baptism_date_formatted.split("/").reverse().join("-"),
        }

        const response =
          id !== ''
            ? await api.put(`/members/${id}`, formData)
            : await api.post('/members', formData);

        if(response.status !== 200) {
          throw new Error();
        }

        addToast({
          type: 'success',
          title: 'Membro guardado com sucesso!',
          description: 'Você será redirecionado para a lista de membros.',
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Houve um erro ao atualizar o perfil, tente novamente.',
        });
      }
    },
    [history, addToast, id],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api
          .post(`/members/${id}/avatar`, data)
          .then(response => {
            addToast({
              title: 'Foto atualizada',
              description: 'Aguarde um pouco, até a foto aparecer.',
              type: 'success',
            });
            handleUpdateAvatarMember(response.data);
          })
          .catch(e => {
            addToast({
              title: 'Houve um erro ao atualizar o avatar',
              description: 'Se o problema persistir, tente mais tarde.',
              type: 'error',
            });
          });
      }
    },
    [addToast, id],
  );

  return (
    <Container>
      <header>
        <div>
          <h1>{ id ? 'Editar membro' : 'Registar membro'}</h1>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form initialData={member} ref={formRef} onSubmit={handleSubmitMember}>
          {id && (
            <AvatarInput>
            <img
              src={member.avatar_url}
              alt={member.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input onChange={handleAvatarChange} type="file" id="avatar" />
            </label>
          </AvatarInput>
          )}
          {!loading && (
            <ContentForm>
              <Row>
                <MyAutocomplete
                  label="Nome"
                  name="name"
                />
                <MyAutocomplete
                  containerStyle={{ width: 100 }}
                  label="Sexo"
                  name="sexy"
                  freeSolo={0}
                  options={optionsSexy}
                />
                <MyAutocomplete
                  containerStyle={{ width: 350 }}
                  label="Data de nasc."
                  name="date_of_birth_formatted"
                />
                <MyAutocomplete
                  containerStyle={{ width: 300 }}
                  label="Nacionalidade"
                  name="nationality"
                  options={optionsNationality}
                />
                <MyAutocomplete
                  containerStyle={{ width: 350 }}
                  label="Documento"
                  name="document"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="marital_status"
                  containerStyle={{ width: 250 }}
                  label="Estado civíl"
                  freeSolo={0}
                  options={optionsMaritalStatus}
                />
                <MyAutocomplete
                  name="spouse_name"
                  label="Nome do cônjugue"
                  options={optionsSpouseName}
                />
                <MyAutocomplete
                  name="wedding_date_formatted"
                  containerStyle={{ width: 250 }}
                  label="Data de casamento"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="mothers_name"
                  label="Nome da mãe"
                  options={optionsWomenName}
                />
                <MyAutocomplete
                  name="fathers_name"
                  label="Nome do pai"
                  options={optionsMenName}
                />
              </Row>

              <Row>
                <MyAutocomplete name="email" label="E-mail" />
                <MyAutocomplete name="telephone" label="Telefone" />
                <MyAutocomplete name="cell_phone" label="Telemóvel" />
              </Row>

              <Row>
                <MyAutocomplete
                  name="postal_code"
                  containerStyle={{ width: 250 }}
                  label="Código Postal"
                  options={optionsPostal}
                />
                <MyAutocomplete
                  name="address"
                  label="Morada"
                  options={optionsAddress}
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="neighborhood"
                  label="Freguesia"
                  options={optionsNeighborhood}
                />
                <MyAutocomplete
                  name="city"
                  label="Concelho"
                  options={optionsCity}
                />
                <MyAutocomplete
                  name="state"
                  label="Distrito"
                  options={optionsState}
                />
                <MyAutocomplete
                  name="country"
                  label="País"
                  options={optionsCountry}
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="coming_church"
                  label="Igreja procedente"
                  options={optionsChurch}
                />
                <MyAutocomplete
                  name="religious_formation"
                  label="Formação religiosa"
                  options={optionsFormation}
                />
                <MyAutocomplete
                  name="baptism_church"
                  label="Igreja de batismo"
                  options={optionsChurch}
                />
                <MyAutocomplete
                  name="baptism_date_formatted"
                  label="Data do batismo"
                />
              </Row>

              <Row>
                <MyAutocomplete
                  name="education_level"
                  label="Formação acadêmica"
                  options={optionsEducation}
                />
                <MyAutocomplete
                  name="course"
                  label="Curso"
                  options={optionsCourse}
                />
                <MyAutocomplete
                  name="profession"
                  label="Profissão"
                  options={optionsProfession}
                />
              </Row>
              <Button type="submit">Confirmar alterações</Button>
            </ContentForm>
          )}
        </Form>
      </Content>
    </Container>
  );
};

export default SaveMember;
